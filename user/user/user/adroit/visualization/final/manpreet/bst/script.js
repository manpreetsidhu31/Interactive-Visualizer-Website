(function() {
  var AVL, Act, BST, Color, anim_or_appear, autorun, autorun_dur, autorun_loop, buttons_edit_playing, buttons_edit_stopped, clear_highlighted, color_of, do_step, draw_new_node, dur_index, durations, init_draw, main, move_bbox, redraw_changed_key, reposition_ptr, reposition_tree, set_cmd_buttons_usable, state, zip_gen;

  BST = class BST {
    constructor(key = null, parent = null) {
      this.key = key;
      this.parent = parent;
      this.left = null;
      this.right = null;
    }

    is_empty() {
      return this.key != null;
    }

    * find(key, result) {
      yield ({
        act: Act.set_self,
        node: this,
        msg: `Searching for ${key}, looking at a ${this.key}`
      });
      if (this.key != null) {
        switch (false) {
          case key !== this.key:
            result.node = this;
            return (yield {
              act: Act.none,
              msg: `Found node with ${key}!`
            });
          case !(key < this.key && (this.left != null)):
            return (yield* this.left.find(key, result));
          case !(this.key < key && (this.right != null)):
            return (yield* this.right.find(key, result));
          default:
            result.node = null;
            return (yield {
              act: Act.none,
              msg: `No node has ${key}`
            });
        }
      }
    }

    * insert(key) {
      yield ({
        act: Act.set_self,
        node: this,
        msg: `Inserting ${key} at node with key = ${this.key}`
      });
      if (this.key == null) {
        this.key = key;
        yield ({
          act: Act.set_key,
          node: this,
          msg: `Empty tree, inserting ${key} as the only element`
        });
        return (yield* this.maintain());
      } else if (key < this.key) {
        if (this.left == null) {
          this.left = new this.constructor(key, this);
          yield ({
            act: Act.new_node,
            node: this.left,
            msg: `New left child node for key ${key}`
          });
          return (yield* this.left.maintain());
        } else {
          return (yield* this.left.insert(key));
        }
      } else {
        if (this.right == null) {
          this.right = new this.constructor(key, this);
          yield ({
            act: Act.new_node,
            node: this.right,
            msg: `New right child node for key ${key}`
          });
          return (yield* this.right.maintain());
        } else {
          return (yield* this.right.insert(key));
        }
      }
    }

    * min_node(result) {
      yield ({
        act: Act.set_self,
        node: this,
        msg: `Finding minimum at node with key = ${this.key}`
      });
      if (this.left != null) {
        return (yield* this.left.min_node(result));
      } else {
        return result.node = this;
      }
    }

    * replace(node) {
      this.key = node.key;
      this.left = node.left;
      this.right = node.right;
      if (this.left != null) {
        this.left.parent = this;
      }
      if (this.right != null) {
        this.right.parent = this;
      }
      return (yield {
        act: Act.replace,
        dest: this,
        src: node,
        msg: "Replacing deleted node with child"
      });
    }

    * delete() {
      var min_result, node;
      yield ({
        act: Act.set_self,
        node: this,
        msg: `Deleting node with key = ${this.key}`
      });
      node = this;
      if ((this.left != null) && (this.right != null)) {
        min_result = {};
        yield* this.right.min_node(min_result);
        node = min_result.node;
        [this.key, node.key] = [node.key, this.key];
        yield ({
          act: Act.swap_key,
          x: this,
          y: node,
          msg: `Swapping ${this.key} with right minimum ${node.key}`
        });
      }
      if (node.right != null) {
        yield* node.replace(node.right);
      } else if (node.left != null) {
        yield* node.replace(node.left);
      } else {
        if (node.parent != null) {
          if (node.parent.right === node) {
            node.parent.right = null;
          } else {
            node.parent.left = null;
          }
          yield ({
            act: Act.delete,
            node: node,
            msg: "Removing leaf"
          });
          node = node.parent;
        } else {
          node.key = null;
          yield ({
            act: Act.set_key,
            node: node,
            msg: "Removing last key"
          });
        }
      }
      return (yield* node.maintain());
    }

    * maintain() {
      return (yield {
        act: Act.set_self,
        node: this,
        msg: ""
      });
    }

    * in_order_traversal() {
      if (this.left != null) {
        yield* this.left.in_order_traversal();
      }
      yield this;
      if (this.right != null) {
        return (yield* this.right.in_order_traversal());
      }
    }

    * pre_order_traversal() {
      yield this;
      if (this.left != null) {
        yield* this.left.pre_order_traversal();
      }
      if (this.right != null) {
        return (yield* this.right.pre_order_traversal());
      }
    }

  };

  AVL = class AVL extends BST {
    constructor(key = null, parent = null) {
      super(key, parent);
      this.height = 0;
      this.skew = 0;
    }

    update() {
      var left_height, right_height;
      left_height = (this.left != null ? this.left.height : -1);
      right_height = (this.right != null ? this.right.height : -1);
      this.height = Math.max(left_height, right_height) + 1;
      return this.skew = right_height - left_height;
    }

    * right_rotate() {
      var a, b, c, node;
      [node, c] = [this.left, this.right];
      [a, b] = [node.left, node.right];
      [this.key, node.key] = [node.key, this.key];
      if (a != null) {
        a.parent = this;
      }
      if (c != null) {
        c.parent = node;
      }
      [this.left, this.right] = [a, node];
      [node.left, node.right] = [b, c];
      node.update();
      this.update();
      return (yield {
        act: Act.swap_key,
        x: this,
        y: node,
        msg: "Right rotate"
      });
    }

    * left_rotate() {
      var a, b, c, node;
      [a, node] = [this.left, this.right];
      [b, c] = [node.left, node.right];
      [this.key, node.key] = [node.key, this.key];
      if (a != null) {
        a.parent = node;
      }
      if (c != null) {
        c.parent = this;
      }
      [this.left, this.right] = [node, c];
      [node.left, node.right] = [a, b];
      node.update();
      this.update();
      return (yield {
        act: Act.swap_key,
        x: this,
        y: node,
        msg: "Left rotate"
      });
    }

    * maintain() {
      this.update();
      yield ({
        act: Act.set_self,
        node: this,
        msg: `Maintain node with key ${this.key}, h = ${this.height}, s = ${this.skew}`
      });
      if (this.skew === 2) {
        if (this.right.skew === -1) {
          yield* this.right.right_rotate();
        }
        yield* this.left_rotate();
      } else if (this.skew === -2) {
        if (this.left.skew === 1) {
          yield* this.left.left_rotate();
        }
        yield* this.right_rotate();
      }
      if (this.parent != null) {
        return (yield* this.parent.maintain());
      }
    }

  };

  //####################################################
  Color = net.brehaut.Color;

  state = {
    root: null
  };

  init_draw = function(draw, empty_root) {
    var edge_group, info, node_group, ptr_group, self_ptr;
    // setup info
    edge_group = draw.group();
    node_group = draw.group();
    ptr_group = draw.group();
    self_ptr = ptr_group.circle(0).fill({
      opacity: 0
    }).stroke({
      color: '#000',
      width: 5
    }).hide();
    info = {
      node_group: node_group,
      edge_group: edge_group,
      ptr_group: ptr_group,
      //nodes: {},
      in_order: [],
      root: empty_root,
      highlighted: draw.set(),
      self: {
        node: empty_root,
        ptr: self_ptr
      }
    };
    // draw empty root
    draw_new_node(node_group, edge_group, empty_root);
    //info.nodes[empty_root.addr] = empty_root
    // position it
    reposition_tree(draw, info);
    info.self.ptr.hide();
    // done!
    return info;
  };

  //##########################################################
  color_of = function(v) {
    if (v != null) {
      return Color({
        hue: v * (360 / 120),
        value: 1,
        saturation: 0.55
      }).toCSS();
    } else {
      return '#ddd';
    }
  };

  // gives each node a unique id associated with the BST node and its SVG representations
  //allocation_index = 0
  draw_new_node = function(ndraw, edraw, node) {
    var c, g, key, pc, t, tbox;
    // draw node itself
    g = ndraw.group();
    c = g.circle(0).fill(color_of(node.key)).stroke({
      opacity: 0 //(color:'#000', width:1)
    });
    key = node.key != null ? node.key : " o ";
    t = g.text(`${key}`).font({
      family: "Monospace",
      size: 40
    });
    tbox = t.bbox();
    c.radius(7 / 8 * Math.max(tbox.width, tbox.height)).move(0, 0);
    t.center(c.cx(), c.cy());
    node.svg = g;
    node.bbox = g.bbox();
    node.bbox.move = move_bbox(node.bbox);
    // give node an id
    //addr = allocation_index
    //allocation_index += 1
    //node.addr = addr
    // draw parent edge if exists
    if (node.parent != null) {
      g.center(node.parent.bbox.cx, node.parent.bbox.cy);
      node.bbox.move({
        x: g.x(),
        y: g.y()
      });
      pc = node.parent.bbox;
      node.parent_edge = edraw.line(node.bbox.cx, node.bbox.cy, pc.cx, pc.cy).stroke({
        color: '#000',
        width: 1
      });
    } else {
      g.move(0, 0);
    }
    return true;
  };

  reposition_tree = function(draw, info, dur) {
    var a, height, i, j, len, len1, node, pos, ref, ref1, ref2, width, x_margin, y;
    // get in-order traversal
    info.in_order = (function() {
      var ref, results;
      ref = info.root.in_order_traversal();
      results = [];
      for (a of ref) {
        results.push(a);
      }
      return results;
    })();
    pos = {};
    // position by x
    x_margin = 0;
    width = 8;
    ref = info.in_order;
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i];
      node.bbox.move({
        x: width
      });
      width += node.bbox.width + x_margin;
    }
    // position by y
    height = 0;
    ref1 = info.root.pre_order_traversal();
    for (node of ref1) {
      y = (node.parent != null ? node.parent.bbox.y + node.parent.bbox.height : 8);
      node.bbox.move({
        y: y
      });
      height = Math.max(height, y + node.bbox.height);
    }
    ref2 = info.in_order;
    // position nodes and edges
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      node = ref2[j];
      anim_or_appear(node.svg, dur).move(node.bbox.x, node.bbox.y);
      if (node.parent_edge != null) {
        anim_or_appear(node.parent_edge, dur).plot(node.bbox.cx, node.bbox.cy, node.parent.bbox.cx, node.parent.bbox.cy);
        true;
      }
    }
    // move ptrs
    reposition_ptr(info.self, dur);
    // set viewbox
    draw.viewbox({
      x: 0,
      y: 0,
      width: width + 8,
      height: height + 8
    });
    draw.size(width, height);
    return true;
  };

  move_bbox = function(bbox) {
    return function(obj) {
      var dx, dy;
      if (obj.x != null) {
        dx = obj.x - bbox.x;
        bbox.x += dx;
        bbox.x2 += dx;
        bbox.cx += dx;
      }
      if (obj.y != null) {
        dy = obj.y - bbox.y;
        bbox.y += dy;
        bbox.y2 += dy;
        bbox.cy += dy;
      }
      return bbox;
    };
  };

  redraw_changed_key = function(info, node) {
    node.svg.remove();
    if (node.parent != null) {
      node.parent_edge.remove();
    }
    return draw_new_node(info.node_group, info.edge_group, node);
  };

  //node.svg.center(orig_bbox.cx, orig_bbox.cy)
  reposition_ptr = function(ptr, dur) {
    return anim_or_appear(ptr.ptr, dur).radius(ptr.node.bbox.width / 2).center(ptr.node.bbox.cx, ptr.node.bbox.cy);
  };

  clear_highlighted = function(info) {
    info.highlighted.stroke({
      opacity: 0
    });
    return info.highlighted.clear();
  };

  //####################################################
  anim_or_appear = function(obj, dur) {
    if (obj.visible()) {
      return obj.animate(dur);
    } else {
      return obj.show();
    }
  };

  Act = {
    none: 0,
    set_self: 1, // from, to
    new_node: 2, // node
    delete: 3, // node
    set_key: 4, // node, k
    swap_key: 5, // x, y
    replace: 6 // src, dest
  };

  do_step = function(draw, info, step) {
    var circle, dur;
    dur = autorun_dur();
    switch (step.act) {
      case Act.none:
        true; // do nothing
        break;
      case Act.set_self: // from, to
        info.self.node = step.node;
        circle = step.node.svg.select('circle');
        circle.animate(dur).stroke({
          color: '#000',
          width: 3,
          opacity: 1
        });
        info.highlighted.add(circle);
        reposition_ptr(info.self, dur);
        break;
      case Act.new_node: // node
        draw_new_node(info.node_group, info.edge_group, step.node);
        reposition_tree(draw, info, dur);
        break;
      case Act.delete: // node
        step.node.svg.remove();
        step.node.parent_edge.remove();
        reposition_tree(draw, info, dur);
        break;
      case Act.set_key: // node
        redraw_changed_key(info, step.node);
        reposition_tree(draw, info, dur);
        break;
      case Act.swap_key: // x, y
        [step.x.svg, step.y.svg] = [step.y.svg, step.x.svg];
        [step.x.bbox, step.y.bbox] = [step.y.bbox, step.x.bbox];
        //[step.x.parent_edge, step.y.parent_edge] = [step.y.parent_edge, step.x.parent_edge]
        //redraw_changed_key(info, step.x)
        //redraw_changed_key(info, step.y)
        reposition_tree(draw, info, dur);
        break;
      case Act.replace: // dest, src
        [step.src.bbox, step.dest.bbox] = [step.dest.bbox, step.src.bbox];
        [step.src.svg, step.dest.svg] = [step.dest.svg, step.src.svg];
        //[step.src.parent_edge, step.dest.parent_edge] = [step.dest.parent_edge, step.src.parent_edge]
        step.src.svg.remove();
        if (step.src.parent_edge != null) {
          step.src.parent_edge.remove();
        }
        reposition_tree(draw, info, dur);
        break;
      default:
        console.log(`Unknown Act ${step.act}`);
    }
    return true;
  };

  //####################################################
  state = {};

  // autorun controls
  dur_index = 0;

  durations = [
    {
      swap: 1000,
      ptr: 600,
      name: "1x Speed"
    },
    {
      swap: 500,
      ptr: 300,
      name: "2x Speed"
    },
    {
      swap: 200,
      ptr: 50,
      name: "5x Speed"
    },
    {
      swap: 50,
      ptr: 10,
      name: "20x Speed"
    }
  ];

  autorun = 0;

  autorun_dur = function() {
    return Math.max(durations[dur_index].swap, durations[dur_index].ptr);
  };

  buttons_edit_playing = function() {
    document.getElementById("play-button").innerHTML = "Pause";
    return document.getElementById("next-button").disabled = "true";
  };

  buttons_edit_stopped = function() {
    document.getElementById("play-button").innerHTML = "Play";
    return document.getElementById("next-button").disabled = null;
  };

  // start/stop play
  window.click_play = function() {
    switch (autorun) {
      case 0: // paused
        autorun = 1;
        buttons_edit_playing();
        return autorun_loop();
      case 1: // already playing
        return autorun = 0;
    }
  };

  // loop
  autorun_loop = function() {
    var dur;
    dur = autorun_dur();
    if (autorun === 1 && window.click_next()) {
      buttons_edit_playing();
      state.avl.draw.animate({
        duration: dur
      }).after(function() {
        return autorun_loop();
      });
    } else if (autorun === 0) {
      buttons_edit_stopped();
    }
    return true;
  };

  window.toggle_turbo = function() {
    dur_index = (dur_index + 1) % durations.length;
    return document.getElementById("turbo-button").innerHTML = durations[dur_index].name;
  };

  set_cmd_buttons_usable = function(can_press) {
    var value;
    value = (can_press ? null : "true");
    document.getElementById("cmd-insert").disabled = value;
    document.getElementById("cmd-find").disabled = value;
    return document.getElementById("cmd-delete").disabled = value;
  };

  zip_gen = function(a, b) {
    return {
      next: function() {
        var an, bn;
        an = a.next();
        bn = b.next();
        return {
          done: an.done && bn.done,
          value: [an, bn]
        };
      }
    };
  };

  window.click_next = function() {
    var next;
    if (state.gen != null) {
      next = state.gen.next();
      if (next.done) {
        state.gen = null;
        set_cmd_buttons_usable(true);
      } else {
        if (!next.value[0].done) {
          do_step(state.avl.draw, state.avl.info, next.value[0].value);
          document.getElementById("avl-msg").innerHTML = `AVL: ${next.value[0].value.msg}`;
        }
        if (!next.value[1].done) {
          do_step(state.bst.draw, state.bst.info, next.value[1].value);
          document.getElementById("bst-msg").innerHTML = `BST: ${next.value[1].value.msg}`;
        }
        set_cmd_buttons_usable(false);
      }
      return true;
    } else {
      return false;
    }
  };

  window.click_insert = function() {
    var key;
    if (state.gen != null) {
      return true; // another operation is on-going
    } else {
      key = Number(document.getElementById("arg-value").value);
      if (!isNaN(key)) {
        clear_highlighted(state.avl.info);
        clear_highlighted(state.bst.info);
        state.gen = zip_gen(state.avl.info.root.insert(key), state.bst.info.root.insert(key));
        autorun = 1;
        return autorun_loop();
      }
    }
  };

  window.click_find = function() {
    var key;
    if (state.gen != null) {
      return true; // another operation is on-going
    } else {
      key = Number(document.getElementById("arg-value").value);
      if (!isNaN(key)) {
        clear_highlighted(state.avl.info);
        clear_highlighted(state.bst.info);
        state.gen = zip_gen(state.avl.info.root.find(key, {}), state.bst.info.root.find(key, {}));
        autorun = 1;
        return autorun_loop();
      }
    }
  };

  window.click_random_key = function() {
    var key;
    key = Math.floor(Math.random() * 100);
    document.getElementById("arg-value").value = `${key}`;
    return window.click_insert();
  };

  window.click_delete = function() {
    var generator, key;
    if (state.gen != null) {
      return true; // another operation is on-going
    } else {
      key = Number(document.getElementById("arg-value").value);
      if (!isNaN(key)) {
        clear_highlighted(state.avl.info);
        clear_highlighted(state.bst.info);
        generator = function*(info) {
          var find_result;
          find_result = {};
          yield* info.root.find(key, find_result);
          if (find_result.node != null) {
            return (yield* find_result.node.delete());
          }
        };
        state.gen = zip_gen(generator(state.avl.info), generator(state.bst.info));
        autorun = 1;
        return autorun_loop();
      }
    }
  };

  main = function() {
    var avl_root, bst_root;
    // avl
    state.avl = {};
    state.avl.draw = SVG('avl-drawing');
    avl_root = new AVL();
    state.avl.info = init_draw(state.avl.draw, avl_root);
    // bst
    state.bst = {};
    state.bst.draw = SVG('bst-drawing');
    bst_root = new BST();
    state.bst.info = init_draw(state.bst.draw, bst_root);
    // other set-up
    return state.gen = null;
  };

  SVG.on(document, 'DOMContentLoaded', main);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxjQUFBLEVBQUEsT0FBQSxFQUFBLFdBQUEsRUFBQSxZQUFBLEVBQUEsb0JBQUEsRUFBQSxvQkFBQSxFQUFBLGlCQUFBLEVBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxhQUFBLEVBQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxrQkFBQSxFQUFBLGNBQUEsRUFBQSxlQUFBLEVBQUEsc0JBQUEsRUFBQSxLQUFBLEVBQUE7O0VBQU0sTUFBTixNQUFBLElBQUE7SUFDRSxXQUFhLENBQUMsTUFBTSxJQUFQLEVBQWEsU0FBUyxJQUF0QixDQUFBO01BQ1gsSUFBSSxDQUFDLEdBQUwsR0FBVztNQUNYLElBQUksQ0FBQyxNQUFMLEdBQWM7TUFDZCxJQUFJLENBQUMsSUFBTCxHQUFZO01BQ1osSUFBSSxDQUFDLEtBQUwsR0FBYTtJQUpGOztJQUtiLFFBQVUsQ0FBQSxDQUFBO2FBQU07SUFBTjs7SUFDSixFQUFOLElBQU0sQ0FBQyxHQUFELEVBQU0sTUFBTixDQUFBO01BQ0osTUFBTyxDQUFBO1FBQUEsR0FBQSxFQUFJLEdBQUcsQ0FBQyxRQUFSO1FBQWtCLElBQUEsRUFBSyxJQUF2QjtRQUE2QixHQUFBLEVBQUksQ0FBQSxjQUFBLENBQUEsQ0FBaUIsR0FBakIsQ0FBQSxlQUFBLENBQUEsQ0FBc0MsSUFBSSxDQUFDLEdBQTNDLENBQUE7TUFBakMsQ0FBQTtNQUNQLElBQUcsZ0JBQUg7QUFDRSxnQkFBQSxLQUFBO0FBQUEsZUFDTyxHQUFBLEtBQU8sSUFBSSxDQUFDLEdBRG5CO1lBRUksTUFBTSxDQUFDLElBQVAsR0FBYzttQkFDZCxDQUFBLE1BQU87Y0FBQSxHQUFBLEVBQUksR0FBRyxDQUFDLElBQVI7Y0FBYyxH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SUFBSSxHQUFKLENBQUE7SUFDWCxLQUFLLENBQUMsR0FBRyxDQUFDLElBQVYsR0FBaUIsU0FBQSxDQUFVLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBcEIsRUFBMEIsUUFBMUIsRUFKbkI7O0lBTUUsS0FBSyxDQUFDLEdBQU4sR0FBWSxDQUFBO0lBQ1osS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFWLEdBQWlCLEdBQUEsQ0FBSSxhQUFKO0lBQ2pCLFFBQUEsR0FBVyxJQUFJLEdBQUosQ0FBQTtJQUNYLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBVixHQUFpQixTQUFBLENBQVUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFwQixFQUEwQixRQUExQixFQVRuQjs7V0FXRSxLQUFLLENBQUMsR0FBTixHQUFZO0VBWlA7O0VBY1AsR0FBRyxDQUFDLEVBQUosQ0FBTyxRQUFQLEVBQWlCLGtCQUFqQixFQUFxQyxJQUFyQztBQTVkQSIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEJTVFxuICBjb25zdHJ1Y3RvcjogKGtleSA9IG51bGwsIHBhcmVudCA9IG51bGwpIC0+XG4gICAgdGhpcy5rZXkgPSBrZXlcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudFxuICAgIHRoaXMubGVmdCA9IG51bGxcbiAgICB0aGlzLnJpZ2h0ID0gbnVsbFxuICBpc19lbXB0eTogKCkgLT4gdGhpcy5rZXk/XG4gIGZpbmQ6IChrZXksIHJlc3VsdCkgLT5cbiAgICB5aWVsZCAoYWN0OkFjdC5zZXRfc2VsZiwgbm9kZTp0aGlzLCBtc2c6XCJTZWFyY2hpbmcgZm9yICN7a2V5fSwgbG9va2luZyBhdCBhICN7dGhpcy5rZXl9XCIpXG4gICAgaWYgdGhpcy5rZXk/XG4gICAgICBzd2l0Y2hcbiAgICAgICAgd2hlbiBrZXkgPT0gdGhpcy5rZXlcbiAgICAgICAgICByZXN1bHQubm9kZSA9IHRoaXNcbiAgICAgICAgICB5aWVsZCAoYWN0OkFjdC5ub25lLCBtc2c6XCJGb3VuZCBub2RlIHdpdGggI3trZXl9IVwiKVxuICAgICAgICB3aGVuIGtleSA8IHRoaXMua2V5IGFuZCB0aGlzLmxlZnQ/XG4gICAgICAgICAgeWllbGQgZnJvbSB0aGlzLmxlZnQuZmluZChrZXkscmVzdWx0KVxuICAgICAgICB3aGVuIHRoaXMua2V5IDwga2V5IGFuZCB0aGlzLnJpZ2h0P1xuICAgICAgICAgIHlpZWxkIGZyb20gdGhpcy5yaWdodC5maW5kKGtleSxyZXN1bHQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXN1bHQubm9kZSA9IG51bGxcbiAgICAgICAgICB5aWVsZCAoYWN0OkFjdC5ub25lLCBtc2c6XCJObyBub2RlIGhhcyAje2tleX1cIilcbiAgaW5zZXJ0OiAoa2V5KSAtPlxuICAgIHlpZWxkIChhY3Q6QWN0LnNldF9zZWxmLCBub2RlOnRoaXMsIG1zZzpcIkluc2VydGluZyAje2tleX0gYXQgbm9kZSB3aXRoIGtleSA9ICN7dGhpcy5rZXl9XCIpXG4gICAgaWYgbm90IHRoaXMua2V5P1xuICAgICAgdGhpcy5rZXkgPSBrZXlcbiAgICAgIHlpZWxkIChhY3Q6QWN0LnNldF9rZXksIG5vZGU6dGhpcywgbXNnOlwiRW1wdHkgdHJlZSwgaW5zZXJ0aW5nICN7a2V5fSBhcyB0aGUgb25seSBlbGVtZW50XCIpXG4gICAgICB5aWVsZCBmcm9tIHRoaXMubWFpbnRhaW4oKVxuICAgIGVsc2UgaWYga2V5IDwgdGhpcy5rZXlcbiAgICAgIGlmIG5vdCB0aGlzLmxlZnQ/XG4gICAgICAgIHRoaXMubGVmdCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGtleSwgdGhpcylcbiAgICAgICAgeWllbGQgKGFjdDpBY3QubmV3X25vZGUsIG5vZGU6dGhpcy5sZWZ0LCBtc2c6XCJOZXcgbGVmdCBjaGlsZCBub2RlIGZvciBrZXkgI3trZXl9XCIpXG4gICAgICAgIHlpZWxkIGZyb20gdGhpcy5sZWZ0Lm1haW50YWluKClcbiAgICAgIGVsc2VcbiAgICAgICAgeWllbGQgZnJvbSB0aGlzLmxlZnQuaW5zZXJ0KGtleSlcbiAgICBlbHNlXG4gICAgICBpZiBub3QgdGhpcy5yaWdodD9cbiAgICAgICAgdGhpcy5yaWdodCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGtleSwgdGhpcylcbiAgICAgICAgeWllbGQgKGFjdDpBY3QubmV3X25vZGUsIG5vZGU6dGhpcy5yaWdodCwgbXNnOlwiTmV3IHJpZ2h0IGNoaWxkIG5vZGUgZm9yIGtleSAje2tleX1cIilcbiAgICAgICAgeWllbGQgZnJvbSB0aGlzLnJpZ2h0Lm1haW50YWluKClcbiAgICAgIGVsc2VcbiAgICAgICAgeWllbGQgZnJvbSB0aGlzLnJpZ2h0Lmluc2VydChrZXkpXG4gIG1pbl9ub2RlOiAocmVzdWx0KSAtPlxuICAgIHlpZWxkIChhY3Q6QWN0LnNldF9zZWxmLCBub2RlOnRoaXMsIG1zZzpcIkZpbmRpbmcgbWluaW11bSBhdCBub2RlIHdpdGgga2V5ID0gI3t0aGlzLmtleX1cIilcbiAgICBpZiB0aGlzLmxlZnQ/XG4gICAgICB5aWVsZCBmcm9tIHRoaXMubGVmdC5taW5fbm9kZShyZXN1bHQpXG4gICAgZWxzZVxuICAgICAgcmVzdWx0Lm5vZGUgPSB0aGlzXG4gIHJlcGxhY2U6IChub2RlKSAtPlxuICAgIHRoaXMua2V5ID0gbm9kZS5rZXlcbiAgICB0aGlzLmxlZnQgPSBub2RlLmxlZnRcbiAgICB0aGlzLnJpZ2h0ID0gbm9kZS5yaWdodFxuICAgIGlmIHRoaXMubGVmdD9cbiAgICAgIHRoaXMubGVmdC5wYXJlbnQgPSB0aGlzXG4gICAgaWYgdGhpcy5yaWdodD9cbiAgICAgIHRoaXMucmlnaHQucGFyZW50ID0gdGhpc1xuICAgIHlpZWxkIChhY3Q6QWN0LnJlcGxhY2UsIGRlc3Q6dGhpcywgc3JjOm5vZGUsIG1zZzpcIlJlcGxhY2luZyBkZWxldGVkIG5vZGUgd2l0aCBjaGlsZFwiKVxuICBkZWxldGU6ICgpIC0+XG4gICAgeWllbGQgKGFjdDpBY3Quc2V0X3NlbGYsIG5vZGU6dGhpcywgbXNnOlwiRGVsZXRpbmcgbm9kZSB3aXRoIGtleSA9ICN7dGhpcy5rZXl9XCIpXG4gICAgbm9kZSA9IHRoaXNcbiAgICBpZiB0aGlzLmxlZnQ/IGFuZCB0aGlzLnJpZ2h0P1xuICAgICAgbWluX3Jlc3VsdCA9IHt9XG4gICAgICB5aWVsZCBmcm9tIHRoaXMucmlnaHQubWluX25vZGUobWluX3Jlc3VsdClcbiAgICAgIG5vZGUgPSBtaW5fcmVzdWx0Lm5vZGVcbiAgICAgIFt0aGlzLmtleSwgbm9kZS5rZXldID0gW25vZGUua2V5LHRoaXMua2V5XVxuICAgICAgeWllbGQgKGFjdDpBY3Quc3dhcF9rZXksIHg6dGhpcywgeTpub2RlLCBtc2c6XCJTd2FwcGluZyAje3RoaXMua2V5fSB3aXRoIHJpZ2h0IG1pbmltdW0gI3tub2RlLmtleX1cIilcbiAgICBpZiBub2RlLnJpZ2h0P1xuICAgICAgeWllbGQgZnJvbSBub2RlLnJlcGxhY2Uobm9kZS5yaWdodClcbiAgICBlbHNlIGlmIG5vZGUubGVmdD9cbiAgICAgIHlpZWxkIGZyb20gbm9kZS5yZXBsYWNlKG5vZGUubGVmdClcbiAgICBlbHNlXG4gICAgICBpZiBub2RlLnBhcmVudD9cbiAgICAgICAgaWYgbm9kZS5wYXJlbnQucmlnaHQgPT0gbm9kZVxuICAgICAgICAgIG5vZGUucGFyZW50LnJpZ2h0ID0gbnVsbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgbm9kZS5wYXJlbnQubGVmdCA9IG51bGxcbiAgICAgICAgeWllbGQgKGFjdDpBY3QuZGVsZXRlLCBub2RlOm5vZGUsIG1zZzpcIlJlbW92aW5nIGxlYWZcIilcbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50XG4gICAgICBlbHNlXG4gICAgICAgIG5vZGUua2V5ID0gbnVsbFxuICAgICAgICB5aWVsZCAoYWN0OkFjdC5zZXRfa2V5LCBub2RlOm5vZGUsIG1zZzpcIlJlbW92aW5nIGxhc3Qga2V5XCIpXG4gICAgeWllbGQgZnJvbSBub2RlLm1haW50YWluKClcbiAgbWFpbnRhaW46ICgpIC0+XG4gICAgeWllbGQgKGFjdDpBY3Quc2V0X3NlbGYsIG5vZGU6dGhpcywgbXNnOlwiXCIpXG4gIGluX29yZGVyX3RyYXZlcnNhbDogKCkgLT5cbiAgICBpZiB0aGlzLmxlZnQ/XG4gICAgICB5aWVsZCBmcm9tIHRoaXMubGVmdC5pbl9vcmRlcl90cmF2ZXJzYWwoKVxuICAgIHlpZWxkIHRoaXNcbiAgICBpZiB0aGlzLnJpZ2h0P1xuICAgICAgeWllbGQgZnJvbSB0aGlzLnJpZ2h0LmluX29yZGVyX3RyYXZlcnNhbCgpXG4gIHByZV9vcmRlcl90cmF2ZXJzYWw6ICgpIC0+XG4gICAgeWllbGQgdGhpc1xuICAgIGlmIHRoaXMubGVmdD9cbiAgICAgIHlpZWxkIGZyb20gdGhpcy5sZWZ0LnByZV9vcmRlcl90cmF2ZXJzYWwoKVxuICAgIGlmIHRoaXMucmlnaHQ/XG4gICAgICB5aWVsZCBmcm9tIHRoaXMucmlnaHQucHJlX29yZGVyX3RyYXZlcnNhbCgpXG5cbmNsYXNzIEFWTCBleHRlbmRzIEJTVFxuICBjb25zdHJ1Y3RvcjogKGtleSA9IG51bGwsIHBhcmVudCA9IG51bGwpIC0+XG4gICAgc3VwZXIoa2V5LHBhcmVudClcbiAgICB0aGlzLmhlaWdodCA9IDBcbiAgICB0aGlzLnNrZXcgPSAwXG4gIHVwZGF0ZTogKCkgLT5cbiAgICBsZWZ0X2hlaWdodCA9IChpZiB0aGlzLmxlZnQ/IHRoZW4gdGhpcy5sZWZ0LmhlaWdodCBlbHNlIC0xKVxuICAgIHJpZ2h0X2hlaWdodCA9IChpZiB0aGlzLnJpZ2h0PyB0aGVuIHRoaXMucmlnaHQuaGVpZ2h0IGVsc2UgLTEpXG4gICAgdGhpcy5oZWlnaHQgPSBNYXRoLm1heChsZWZ0X2hlaWdodCwgcmlnaHRfaGVpZ2h0KSArIDFcbiAgICB0aGlzLnNrZXcgPSByaWdodF9oZWlnaHQgLSBsZWZ0X2hlaWdodFxuICByaWdodF9yb3RhdGU6ICgpIC0+XG4gICAgW25vZGUsIGNdID0gW3RoaXMubGVmdCwgdGhpcy5yaWdodF1cbiAgICBbYSwgYl0gICAgPSBbbm9kZS5sZWZ0LCBub2RlLnJpZ2h0XVxuICAgIFt0aGlzLmtleSwgbm9kZS5rZXldID0gW25vZGUua2V5LCB0aGlzLmtleV1cbiAgICBpZiBhP1xuICAgICAgYS5wYXJlbnQgPSB0aGlzXG4gICAgaWYgYz9cbiAgICAgIGMucGFyZW50ID0gbm9kZVxuICAgIFt0aGlzLmxlZnQsIHRoaXMucmlnaHRdID0gW2EsIG5vZGVdXG4gICAgW25vZGUubGVmdCwgbm9kZS5yaWdodF0gPSBbYiwgY11cbiAgICBub2RlLnVwZGF0ZSgpXG4gICAgdGhpcy51cGRhdGUoKVxuICAgIHlpZWxkIChhY3Q6QWN0LnN3YXBfa2V5LCB4OnRoaXMsIHk6bm9kZSwgbXNnOlwiUmlnaHQgcm90YXRlXCIpXG4gIGxlZnRfcm90YXRlOiAoKSAtPlxuICAgIFthLCBub2RlXSA9IFt0aGlzLmxlZnQsIHRoaXMucmlnaHRdXG4gICAgW2IsIGNdICAgID0gW25vZGUubGVmdCwgbm9kZS5yaWdodF1cbiAgICBbdGhpcy5rZXksIG5vZGUua2V5XSA9IFtub2RlLmtleSwgdGhpcy5rZXldXG4gICAgaWYgYT9cbiAgICAgIGEucGFyZW50ID0gbm9kZVxuICAgIGlmIGM/XG4gICAgICBjLnBhcmVudCA9IHRoaXNcbiAgICBbdGhpcy5sZWZ0LCB0aGlzLnJpZ2h0XSA9IFtub2RlLCBjXVxuICAgIFtub2RlLmxlZnQsIG5vZGUucmlnaHRdID0gW2EsIGJdXG4gICAgbm9kZS51cGRhdGUoKVxuICAgIHRoaXMudXBkYXRlKClcbiAgICB5aWVsZCAoYWN0OkFjdC5zd2FwX2tleSwgeDp0aGlzLCB5Om5vZGUsIG1zZzpcIkxlZnQgcm90YXRlXCIpXG4gIG1haW50YWluOiAoKSAtPlxuICAgIHRoaXMudXBkYXRlKClcbiAgICB5aWVsZCAoYWN0OkFjdC5zZXRfc2VsZiwgbm9kZTp0aGlzLCBtc2c6XCJNYWludGFpbiBub2RlIHdpdGgga2V5ICN7dGhpcy5rZXl9LCBoID0gI3t0aGlzLmhlaWdodH0sIHMgPSAje3RoaXMuc2tld31cIilcbiAgICBpZiB0aGlzLnNrZXcgPT0gMlxuICAgICAgaWYgdGhpcy5yaWdodC5za2V3ID09IC0xXG4gICAgICAgIHlpZWxkIGZyb20gdGhpcy5yaWdodC5yaWdodF9yb3RhdGUoKVxuICAgICAgeWllbGQgZnJvbSB0aGlzLmxlZnRfcm90YXRlKClcbiAgICBlbHNlIGlmIHRoaXMuc2tldyA9PSAtMlxuICAgICAgaWYgdGhpcy5sZWZ0LnNrZXcgPT0gMVxuICAgICAgICB5aWVsZCBmcm9tIHRoaXMubGVmdC5sZWZ0X3JvdGF0ZSgpXG4gICAgICB5aWVsZCBmcm9tIHRoaXMucmlnaHRfcm90YXRlKClcbiAgICBpZiB0aGlzLnBhcmVudD9cbiAgICAgIHlpZWxkIGZyb20gdGhpcy5wYXJlbnQubWFpbnRhaW4oKVxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5Db2xvciA9IG5ldC5icmVoYXV0LkNvbG9yXG5cbnN0YXRlID0gKHJvb3Q6IG51bGwpXG5cbmluaXRfZHJhdyA9IChkcmF3LCBlbXB0eV9yb290KSAtPlxuICAjIHNldHVwIGluZm9cbiAgZWRnZV9ncm91cCA9IGRyYXcuZ3JvdXAoKVxuICBub2RlX2dyb3VwID0gZHJhdy5ncm91cCgpXG4gIHB0cl9ncm91cCA9IGRyYXcuZ3JvdXAoKVxuICBzZWxmX3B0ciA9IHB0cl9ncm91cC5jaXJjbGUoMClcbiAgICAgICAgICAgICAgICAgICAgICAuZmlsbChvcGFjaXR5OjApXG4gICAgICAgICAgICAgICAgICAgICAgLnN0cm9rZShjb2xvcjonIzAwMCcsd2lkdGg6NSlcbiAgICAgICAgICAgICAgICAgICAgICAuaGlkZSgpXG4gIGluZm8gPSAoXG4gICAgbm9kZV9ncm91cDogbm9kZV9ncm91cCxcbiAgICBlZGdlX2dyb3VwOiBlZGdlX2dyb3VwLFxuICAgIHB0cl9ncm91cDogcHRyX2dyb3VwLFxuICAgICNub2Rlczoge30sXG4gICAgaW5fb3JkZXI6IFtdLFxuICAgIHJvb3Q6IGVtcHR5X3Jvb3QsXG4gICAgaGlnaGxpZ2h0ZWQ6IGRyYXcuc2V0KCksXG4gICAgc2VsZjogKG5vZGU6ZW1wdHlfcm9vdCwgcHRyOnNlbGZfcHRyKVxuICApXG4gICMgZHJhdyBlbXB0eSByb290XG4gIGRyYXdfbmV3X25vZGUobm9kZV9ncm91cCwgZWRnZV9ncm91cCwgZW1wdHlfcm9vdClcbiAgI2luZm8ubm9kZXNbZW1wdHlfcm9vdC5hZGRyXSA9IGVtcHR5X3Jvb3RcbiAgIyBwb3NpdGlvbiBpdFxuICByZXBvc2l0aW9uX3RyZWUoZHJhdywgaW5mbylcbiAgaW5mby5zZWxmLnB0ci5oaWRlKClcbiAgIyBkb25lIVxuICByZXR1cm4gaW5mb1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5jb2xvcl9vZiA9ICh2KSAtPlxuICBpZiB2P1xuICAgIHJldHVybiBDb2xvcihodWU6IHYgKiAoMzYwIC8gMTIwKSwgdmFsdWU6IDEsIHNhdHVyYXRpb246IDAuNTUpLnRvQ1NTKClcbiAgZWxzZVxuICAgIHJldHVybiAnI2RkZCdcblxuIyBnaXZlcyBlYWNoIG5vZGUgYSB1bmlxdWUgaWQgYXNzb2NpYXRlZCB3aXRoIHRoZSBCU1Qgbm9kZSBhbmQgaXRzIFNWRyByZXByZXNlbnRhdGlvbnNcbiNhbGxvY2F0aW9uX2luZGV4ID0gMFxuXG5kcmF3X25ld19ub2RlID0gKG5kcmF3LCBlZHJhdywgbm9kZSkgLT5cbiAgIyBkcmF3IG5vZGUgaXRzZWxmXG4gIGcgPSBuZHJhdy5ncm91cCgpXG4gIGMgPSBnLmNpcmNsZSgwKVxuICAgICAgIC5maWxsKGNvbG9yX29mKG5vZGUua2V5KSlcbiAgICAgICAuc3Ryb2tlKG9wYWNpdHk6MCkjKGNvbG9yOicjMDAwJywgd2lkdGg6MSlcbiAga2V5ID0gaWYgbm9kZS5rZXk/IHRoZW4gbm9kZS5rZXkgZWxzZSBcIuKIhVwiXG4gIHQgPSBnLnRleHQoXCIje2tleX1cIilcbiAgICAgICAuZm9udChmYW1pbHk6XCJNb25vc3BhY2VcIixzaXplOjEyKVxuICB0Ym94ID0gdC5iYm94KClcbiAgYy5yYWRpdXMoNy84ICogTWF0aC5tYXgodGJveC53aWR0aCwgdGJveC5oZWlnaHQpKVxuICAgLm1vdmUoMCwwKVxuICB0LmNlbnRlcihjLmN4KCksIGMuY3koKSlcbiAgbm9kZS5zdmcgPSBnXG4gIG5vZGUuYmJveCA9IGcuYmJveCgpXG4gIG5vZGUuYmJveC5tb3ZlID0gbW92ZV9iYm94KG5vZGUuYmJveClcbiAgIyBnaXZlIG5vZGUgYW4gaWRcbiAgI2FkZHIgPSBhbGxvY2F0aW9uX2luZGV4XG4gICNhbGxvY2F0aW9uX2luZGV4ICs9IDFcbiAgI25vZGUuYWRkciA9IGFkZHJcbiAgIyBkcmF3IHBhcmVudCBlZGdlIGlmIGV4aXN0c1xuICBpZiBub2RlLnBhcmVudD9cbiAgICBnLmNlbnRlcihub2RlLnBhcmVudC5iYm94LmN4LCBub2RlLnBhcmVudC5iYm94LmN5KVxuICAgIG5vZGUuYmJveC5tb3ZlKHg6Zy54KCksIHk6Zy55KCkpXG4gICAgcGMgPSBub2RlLnBhcmVudC5iYm94XG4gICAgbm9kZS5wYXJlbnRfZWRnZSA9IGVkcmF3LmxpbmUobm9kZS5iYm94LmN4LCBub2RlLmJib3guY3ksIHBjLmN4LCBwYy5jeSkuc3Ryb2tlKGNvbG9yOicjMDAwJyx3aWR0aDoxKVxuICBlbHNlXG4gICAgZy5tb3ZlKDAsMClcbiAgdHJ1ZVxuXG5yZXBvc2l0aW9uX3RyZWUgPSAoZHJhdywgaW5mbywgZHVyKSAtPlxuICAjIGdldCBpbi1vcmRlciB0cmF2ZXJzYWxcbiAgaW5mby5pbl9vcmRlciA9IChhIGZvciBhIGZyb20gaW5mby5yb290LmluX29yZGVyX3RyYXZlcnNhbCgpKVxuICBwb3MgPSB7fVxuICAjIHBvc2l0aW9uIGJ5IHhcbiAgeF9tYXJnaW4gPSAwXG4gIHdpZHRoID0gOFxuICBmb3Igbm9kZSBpbiBpbmZvLmluX29yZGVyXG4gICAgbm9kZS5iYm94Lm1vdmUoeDp3aWR0aClcbiAgICB3aWR0aCArPSBub2RlLmJib3gud2lkdGggKyB4X21hcmdpblxuICAjIHBvc2l0aW9uIGJ5IHlcbiAgaGVpZ2h0ID0gMFxuICBmb3Igbm9kZSBmcm9tIGluZm8ucm9vdC5wcmVfb3JkZXJfdHJhdmVyc2FsKClcbiAgICB5ID0gKGlmIG5vZGUucGFyZW50PyB0aGVuIG5vZGUucGFyZW50LmJib3gueSArIG5vZGUucGFyZW50LmJib3guaGVpZ2h0IGVsc2UgOClcbiAgICBub2RlLmJib3gubW92ZSh5OnkpXG4gICAgaGVpZ2h0ID0gTWF0aC5tYXgoaGVpZ2h0LCB5ICsgbm9kZS5iYm94LmhlaWdodClcbiAgIyBwb3NpdGlvbiBub2RlcyBhbmQgZWRnZXNcbiAgZm9yIG5vZGUgaW4gaW5mby5pbl9vcmRlclxuICAgIGFuaW1fb3JfYXBwZWFyKG5vZGUuc3ZnLCBkdXIpLm1vdmUobm9kZS5iYm94LngsIG5vZGUuYmJveC55KVxuICAgIGlmIG5vZGUucGFyZW50X2VkZ2U/XG4gICAgICBhbmltX29yX2FwcGVhcihub2RlLnBhcmVudF9lZGdlLCBkdXIpLnBsb3Qobm9kZS5iYm94LmN4LCBub2RlLmJib3guY3ksIG5vZGUucGFyZW50LmJib3guY3gsIG5vZGUucGFyZW50LmJib3guY3kpXG4gICAgICB0cnVlXG4gICMgbW92ZSBwdHJzXG4gIHJlcG9zaXRpb25fcHRyKGluZm8uc2VsZiwgZHVyKVxuICAjIHNldCB2aWV3Ym94XG4gIGRyYXcudmlld2JveCh4OjAsIHk6MCwgd2lkdGg6IHdpZHRoICsgOCwgaGVpZ2h0OiBoZWlnaHQgKyA4KVxuICBkcmF3LnNpemUod2lkdGgsaGVpZ2h0KVxuICB0cnVlXG5cbm1vdmVfYmJveCA9IChiYm94KSAtPiAob2JqKSAtPlxuICBpZiBvYmoueD9cbiAgICBkeCA9IG9iai54IC0gYmJveC54XG4gICAgYmJveC54ICs9IGR4XG4gICAgYmJveC54MiArPSBkeFxuICAgIGJib3guY3ggKz0gZHhcbiAgaWYgb2JqLnk/XG4gICAgZHkgPSBvYmoueSAtIGJib3gueVxuICAgIGJib3gueSArPSBkeVxuICAgIGJib3gueTIgKz0gZHlcbiAgICBiYm94LmN5ICs9IGR5XG4gIHJldHVybiBiYm94XG5cbnJlZHJhd19jaGFuZ2VkX2tleSA9IChpbmZvLCBub2RlKSAtPlxuICBub2RlLnN2Zy5yZW1vdmUoKVxuICBpZiBub2RlLnBhcmVudD9cbiAgICBub2RlLnBhcmVudF9lZGdlLnJlbW92ZSgpXG4gIGRyYXdfbmV3X25vZGUoaW5mby5ub2RlX2dyb3VwLCBpbmZvLmVkZ2VfZ3JvdXAsIG5vZGUpXG4gICNub2RlLnN2Zy5jZW50ZXIob3JpZ19iYm94LmN4LCBvcmlnX2Jib3guY3kpXG5cbnJlcG9zaXRpb25fcHRyID0gKHB0ciwgZHVyKSAtPlxuICBhbmltX29yX2FwcGVhcihwdHIucHRyLCBkdXIpXG4gICAgLnJhZGl1cyhwdHIubm9kZS5iYm94LndpZHRoLzIpXG4gICAgLmNlbnRlcihwdHIubm9kZS5iYm94LmN4LCBwdHIubm9kZS5iYm94LmN5KVxuXG5jbGVhcl9oaWdobGlnaHRlZCA9IChpbmZvKSAtPlxuICBpbmZvLmhpZ2hsaWdodGVkLnN0cm9rZShvcGFjaXR5OjApXG4gIGluZm8uaGlnaGxpZ2h0ZWQuY2xlYXIoKVxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuYW5pbV9vcl9hcHBlYXIgPSAob2JqLCBkdXIpIC0+XG4gIGlmIG9iai52aXNpYmxlKClcbiAgICByZXR1cm4gb2JqLmFuaW1hdGUoZHVyKVxuICBlbHNlXG4gICAgcmV0dXJuIG9iai5zaG93KClcblxuQWN0ID1cbiAgbm9uZTowXG4gIHNldF9zZWxmOjEgIyBmcm9tLCB0b1xuICBuZXdfbm9kZToyICMgbm9kZVxuICBkZWxldGU6MyAjIG5vZGVcbiAgc2V0X2tleTo0ICMgbm9kZSwga1xuICBzd2FwX2tleTo1ICMgeCwgeVxuICByZXBsYWNlOjYgIyBzcmMsIGRlc3RcblxuZG9fc3RlcCA9IChkcmF3LCBpbmZvLCBzdGVwKSAtPlxuICBkdXIgPSBhdXRvcnVuX2R1cigpXG4gIHN3aXRjaCBzdGVwLmFjdFxuICAgIHdoZW4gQWN0Lm5vbmVcbiAgICAgIHRydWUgIyBkbyBub3RoaW5nXG4gICAgd2hlbiBBY3Quc2V0X3NlbGYgIyBmcm9tLCB0b1xuICAgICAgaW5mby5zZWxmLm5vZGUgPSBzdGVwLm5vZGVcbiAgICAgIGNpcmNsZSA9IHN0ZXAubm9kZS5zdmcuc2VsZWN0KCdjaXJjbGUnKVxuICAgICAgY2lyY2xlLmFuaW1hdGUoZHVyKS5zdHJva2UoY29sb3I6JyMwMDAnLCB3aWR0aDozLCBvcGFjaXR5OjEpXG4gICAgICBpbmZvLmhpZ2hsaWdodGVkLmFkZChjaXJjbGUpXG4gICAgICByZXBvc2l0aW9uX3B0cihpbmZvLnNlbGYsIGR1cilcbiAgICB3aGVuIEFjdC5uZXdfbm9kZSAjIG5vZGVcbiAgICAgIGRyYXdfbmV3X25vZGUoaW5mby5ub2RlX2dyb3VwLCBpbmZvLmVkZ2VfZ3JvdXAsIHN0ZXAubm9kZSlcbiAgICAgIHJlcG9zaXRpb25fdHJlZShkcmF3LCBpbmZvLCBkdXIpXG4gICAgd2hlbiBBY3QuZGVsZXRlICMgbm9kZVxuICAgICAgc3RlcC5ub2RlLnN2Zy5yZW1vdmUoKVxuICAgICAgc3RlcC5ub2RlLnBhcmVudF9lZGdlLnJlbW92ZSgpXG4gICAgICByZXBvc2l0aW9uX3RyZWUoZHJhdywgaW5mbywgZHVyKVxuICAgIHdoZW4gQWN0LnNldF9rZXkgIyBub2RlXG4gICAgICByZWRyYXdfY2hhbmdlZF9rZXkoaW5mbywgc3RlcC5ub2RlKVxuICAgICAgcmVwb3NpdGlvbl90cmVlKGRyYXcsIGluZm8sIGR1cilcbiAgICB3aGVuIEFjdC5zd2FwX2tleSAjIHgsIHlcbiAgICAgIFtzdGVwLnguc3ZnLCBzdGVwLnkuc3ZnXSA9IFtzdGVwLnkuc3ZnLCBzdGVwLnguc3ZnXVxuICAgICAgW3N0ZXAueC5iYm94LCBzdGVwLnkuYmJveF0gPSBbc3RlcC55LmJib3gsIHN0ZXAueC5iYm94XVxuICAgICAgI1tzdGVwLngucGFyZW50X2VkZ2UsIHN0ZXAueS5wYXJlbnRfZWRnZV0gPSBbc3RlcC55LnBhcmVudF9lZGdlLCBzdGVwLngucGFyZW50X2VkZ2VdXG4gICAgICAjcmVkcmF3X2NoYW5nZWRfa2V5KGluZm8sIHN0ZXAueClcbiAgICAgICNyZWRyYXdfY2hhbmdlZF9rZXkoaW5mbywgc3RlcC55KVxuICAgICAgcmVwb3NpdGlvbl90cmVlKGRyYXcsIGluZm8sIGR1cilcbiAgICB3aGVuIEFjdC5yZXBsYWNlICMgZGVzdCwgc3JjXG4gICAgICBbc3RlcC5zcmMuYmJveCwgc3RlcC5kZXN0LmJib3hdID0gW3N0ZXAuZGVzdC5iYm94LCBzdGVwLnNyYy5iYm94XVxuICAgICAgW3N0ZXAuc3JjLnN2Zywgc3RlcC5kZXN0LnN2Z10gPSBbc3RlcC5kZXN0LnN2Zywgc3RlcC5zcmMuc3ZnXVxuICAgICAgI1tzdGVwLnNyYy5wYXJlbnRfZWRnZSwgc3RlcC5kZXN0LnBhcmVudF9lZGdlXSA9IFtzdGVwLmRlc3QucGFyZW50X2VkZ2UsIHN0ZXAuc3JjLnBhcmVudF9lZGdlXVxuICAgICAgc3RlcC5zcmMuc3ZnLnJlbW92ZSgpXG4gICAgICBpZiBzdGVwLnNyYy5wYXJlbnRfZWRnZT9cbiAgICAgICAgc3RlcC5zcmMucGFyZW50X2VkZ2UucmVtb3ZlKClcbiAgICAgIHJlcG9zaXRpb25fdHJlZShkcmF3LCBpbmZvLCBkdXIpXG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIEFjdCAje3N0ZXAuYWN0fVwiKVxuICB0cnVlXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbnN0YXRlID0ge31cblxuIyBhdXRvcnVuIGNvbnRyb2xzXG5kdXJfaW5kZXggPSAwXG5kdXJhdGlvbnMgPSBbXG4gIChzd2FwOjEwMDAsIHB0cjo2MDAsIG5hbWU6XCIxeCBTcGVlZFwiKVxuICAoc3dhcDo1MDAsIHB0cjozMDAsIG5hbWU6XCIyeCBTcGVlZFwiKSxcbiAgKHN3YXA6MjAwLCBwdHI6NTAsIG5hbWU6XCI1eCBTcGVlZFwiKSxcbiAgKHN3YXA6NTAsIHB0cjoxMCwgbmFtZTpcIjIweCBTcGVlZFwiKVxuXVxuYXV0b3J1biA9IDBcbmF1dG9ydW5fZHVyID0gKCkgLT4gTWF0aC5tYXgoZHVyYXRpb25zW2R1cl9pbmRleF0uc3dhcCwgZHVyYXRpb25zW2R1cl9pbmRleF0ucHRyKVxuYnV0dG9uc19lZGl0X3BsYXlpbmcgPSAoKSAtPlxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktYnV0dG9uXCIpLmlubmVySFRNTCA9IFwiUGF1c2VcIlxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5leHQtYnV0dG9uXCIpLmRpc2FibGVkID0gXCJ0cnVlXCJcbmJ1dHRvbnNfZWRpdF9zdG9wcGVkID0gKCkgLT5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWJ1dHRvblwiKS5pbm5lckhUTUwgPSBcIlBsYXlcIlxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5leHQtYnV0dG9uXCIpLmRpc2FibGVkID0gbnVsbFxuIyBzdGFydC9zdG9wIHBsYXlcbndpbmRvdy5jbGlja19wbGF5ID0gKCkgLT5cbiAgc3dpdGNoIGF1dG9ydW5cbiAgICB3aGVuIDAgIyBwYXVzZWRcbiAgICAgIGF1dG9ydW4gPSAxXG4gICAgICBidXR0b25zX2VkaXRfcGxheWluZygpXG4gICAgICBhdXRvcnVuX2xvb3AoKVxuICAgIHdoZW4gMSAjIGFscmVhZHkgcGxheWluZ1xuICAgICAgYXV0b3J1biA9IDBcbiMgbG9vcFxuYXV0b3J1bl9sb29wID0gKCkgLT5cbiAgZHVyID0gYXV0b3J1bl9kdXIoKVxuICBpZiBhdXRvcnVuID09IDEgYW5kIHdpbmRvdy5jbGlja19uZXh0KClcbiAgICBidXR0b25zX2VkaXRfcGxheWluZygpXG4gICAgc3RhdGUuYXZsLmRyYXcuYW5pbWF0ZShkdXJhdGlvbjpkdXIpLmFmdGVyKCgpIC0+IGF1dG9ydW5fbG9vcCgpKVxuICBlbHNlIGlmIGF1dG9ydW4gPT0gMFxuICAgIGJ1dHRvbnNfZWRpdF9zdG9wcGVkKClcbiAgdHJ1ZVxuXG53aW5kb3cudG9nZ2xlX3R1cmJvID0gKCkgLT5cbiAgZHVyX2luZGV4ID0gKGR1cl9pbmRleCArIDEpICUgZHVyYXRpb25zLmxlbmd0aFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cmJvLWJ1dHRvblwiKS5pbm5lckhUTUwgPSBkdXJhdGlvbnNbZHVyX2luZGV4XS5uYW1lXG5cbnNldF9jbWRfYnV0dG9uc191c2FibGUgPSAoY2FuX3ByZXNzKSAtPlxuICB2YWx1ZSA9IChpZiBjYW5fcHJlc3MgdGhlbiBudWxsIGVsc2UgXCJ0cnVlXCIpXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY21kLWluc2VydFwiKS5kaXNhYmxlZCA9IHZhbHVlXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY21kLWZpbmRcIikuZGlzYWJsZWQgPSB2YWx1ZVxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNtZC1kZWxldGVcIikuZGlzYWJsZWQgPSB2YWx1ZVxuXG56aXBfZ2VuID0gKGEsYikgLT4gKFxuICBuZXh0OiAoKSAtPlxuICAgIGFuID0gYS5uZXh0KClcbiAgICBibiA9IGIubmV4dCgpXG4gICAgcmV0dXJuIChcbiAgICAgIGRvbmU6KGFuLmRvbmUgYW5kIGJuLmRvbmUpXG4gICAgICB2YWx1ZTpbYW4sIGJuXSkpXG5cbndpbmRvdy5jbGlja19uZXh0ID0gKCkgLT5cbiAgaWYgc3RhdGUuZ2VuP1xuICAgIG5leHQgPSBzdGF0ZS5nZW4ubmV4dCgpXG4gICAgaWYgbmV4dC5kb25lXG4gICAgICBzdGF0ZS5nZW4gPSBudWxsXG4gICAgICBzZXRfY21kX2J1dHRvbnNfdXNhYmxlKHRydWUpXG4gICAgZWxzZVxuICAgICAgaWYgbm90IG5leHQudmFsdWVbMF0uZG9uZVxuICAgICAgICBkb19zdGVwKHN0YXRlLmF2bC5kcmF3LCBzdGF0ZS5hdmwuaW5mbywgbmV4dC52YWx1ZVswXS52YWx1ZSlcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhdmwtbXNnXCIpLmlubmVySFRNTCA9IFwiQVZMOiAje25leHQudmFsdWVbMF0udmFsdWUubXNnfVwiXG4gICAgICBpZiBub3QgbmV4dC52YWx1ZVsxXS5kb25lXG4gICAgICAgIGRvX3N0ZXAoc3RhdGUuYnN0LmRyYXcsIHN0YXRlLmJzdC5pbmZvLCBuZXh0LnZhbHVlWzFdLnZhbHVlKVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJzdC1tc2dcIikuaW5uZXJIVE1MID0gXCJCU1Q6ICN7bmV4dC52YWx1ZVsxXS52YWx1ZS5tc2d9XCJcbiAgICAgIHNldF9jbWRfYnV0dG9uc191c2FibGUoZmFsc2UpXG4gICAgdHJ1ZVxuICBlbHNlXG4gICAgZmFsc2Vcblxud2luZG93LmNsaWNrX2luc2VydCA9ICgpIC0+XG4gIGlmIHN0YXRlLmdlbj9cbiAgICB0cnVlICMgYW5vdGhlciBvcGVyYXRpb24gaXMgb24tZ29pbmdcbiAgZWxzZVxuICAgIGtleSA9IE51bWJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyZy12YWx1ZVwiKS52YWx1ZSlcbiAgICBpZiBub3QgaXNOYU4oa2V5KVxuICAgICAgY2xlYXJfaGlnaGxpZ2h0ZWQoc3RhdGUuYXZsLmluZm8pXG4gICAgICBjbGVhcl9oaWdobGlnaHRlZChzdGF0ZS5ic3QuaW5mbylcbiAgICAgIHN0YXRlLmdlbiA9IHppcF9nZW4oXG4gICAgICAgIHN0YXRlLmF2bC5pbmZvLnJvb3QuaW5zZXJ0KGtleSksXG4gICAgICAgIHN0YXRlLmJzdC5pbmZvLnJvb3QuaW5zZXJ0KGtleSkpXG4gICAgICBhdXRvcnVuID0gMVxuICAgICAgYXV0b3J1bl9sb29wKClcblxud2luZG93LmNsaWNrX2ZpbmQgPSAoKSAtPlxuICBpZiBzdGF0ZS5nZW4/XG4gICAgdHJ1ZSAjIGFub3RoZXIgb3BlcmF0aW9uIGlzIG9uLWdvaW5nXG4gIGVsc2VcbiAgICBrZXkgPSBOdW1iZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcmctdmFsdWVcIikudmFsdWUpXG4gICAgaWYgbm90IGlzTmFOKGtleSlcbiAgICAgIGNsZWFyX2hpZ2hsaWdodGVkKHN0YXRlLmF2bC5pbmZvKVxuICAgICAgY2xlYXJfaGlnaGxpZ2h0ZWQoc3RhdGUuYnN0LmluZm8pXG4gICAgICBzdGF0ZS5nZW4gPSB6aXBfZ2VuKFxuICAgICAgICBzdGF0ZS5hdmwuaW5mby5yb290LmZpbmQoa2V5LCB7fSksXG4gICAgICAgIHN0YXRlLmJzdC5pbmZvLnJvb3QuZmluZChrZXksIHt9KSlcbiAgICAgIGF1dG9ydW4gPSAxXG4gICAgICBhdXRvcnVuX2xvb3AoKVxuXG53aW5kb3cuY2xpY2tfcmFuZG9tX2tleSA9ICgpIC0+XG4gIGtleSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMClcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcmctdmFsdWVcIikudmFsdWUgPSBcIiN7a2V5fVwiXG4gIHdpbmRvdy5jbGlja19pbnNlcnQoKVxuXG53aW5kb3cuY2xpY2tfZGVsZXRlID0gKCkgLT5cbiAgaWYgc3RhdGUuZ2VuP1xuICAgIHRydWUgIyBhbm90aGVyIG9wZXJhdGlvbiBpcyBvbi1nb2luZ1xuICBlbHNlXG4gICAga2V5ID0gTnVtYmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJnLXZhbHVlXCIpLnZhbHVlKVxuICAgIGlmIG5vdCBpc05hTihrZXkpXG4gICAgICBjbGVhcl9oaWdobGlnaHRlZChzdGF0ZS5hdmwuaW5mbylcbiAgICAgIGNsZWFyX2hpZ2hsaWdodGVkKHN0YXRlLmJzdC5pbmZvKVxuICAgICAgZ2VuZXJhdG9yID0gKGluZm8pIC0+XG4gICAgICAgIGZpbmRfcmVzdWx0ID0ge31cbiAgICAgICAgeWllbGQgZnJvbSBpbmZvLnJvb3QuZmluZChrZXksIGZpbmRfcmVzdWx0KVxuICAgICAgICBpZiBmaW5kX3Jlc3VsdC5ub2RlP1xuICAgICAgICAgIHlpZWxkIGZyb20gZmluZF9yZXN1bHQubm9kZS5kZWxldGUoKVxuICAgICAgc3RhdGUuZ2VuID0gemlwX2dlbihcbiAgICAgICAgZ2VuZXJhdG9yKHN0YXRlLmF2bC5pbmZvKSxcbiAgICAgICAgZ2VuZXJhdG9yKHN0YXRlLmJzdC5pbmZvKSlcbiAgICAgIGF1dG9ydW4gPSAxXG4gICAgICBhdXRvcnVuX2xvb3AoKVxuXG5tYWluID0gKCkgLT5cbiAgIyBhdmxcbiAgc3RhdGUuYXZsID0ge31cbiAgc3RhdGUuYXZsLmRyYXcgPSBTVkcoJ2F2bC1kcmF3aW5nJylcbiAgYXZsX3Jvb3QgPSBuZXcgQVZMKClcbiAgc3RhdGUuYXZsLmluZm8gPSBpbml0X2RyYXcoc3RhdGUuYXZsLmRyYXcsIGF2bF9yb290KVxuICAjIGJzdFxuICBzdGF0ZS5ic3QgPSB7fVxuICBzdGF0ZS5ic3QuZHJhdyA9IFNWRygnYnN0LWRyYXdpbmcnKVxuICBic3Rfcm9vdCA9IG5ldyBCU1QoKVxuICBzdGF0ZS5ic3QuaW5mbyA9IGluaXRfZHJhdyhzdGF0ZS5ic3QuZHJhdywgYnN0X3Jvb3QpXG4gICMgb3RoZXIgc2V0LXVwXG4gIHN0YXRlLmdlbiA9IG51bGxcblxuU1ZHLm9uKGRvY3VtZW50LCAnRE9NQ29udGVudExvYWRlZCcsIG1haW4pIl19
//# sourceURL=coffeescript