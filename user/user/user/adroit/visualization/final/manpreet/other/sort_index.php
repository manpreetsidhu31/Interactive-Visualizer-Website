<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sorting Visualization</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
</head>

<ul>  
    <li style="padding-left: 100px; padding-top: 10px;"><img src="logof.png" alt="Logo" width="200"></li>
    <li style="float:right; padding: 20px; padding-right: 40px;"><a href="../../visindex.php">
      <i class ="fa fa-user-plus" ></i> << Back</a></li>
      <li class="nav-item">
    <a href="#" data-toggle="dropdown" role="button" aria-expanded="false">
    <!--img src="images/user.png" alt="" width = "30px" height = "30px" fa fa-user fa-lg"/-->
    <span class="admin-name"><i class="fa fa-user fa-spin fa-lg"></i> </i>&nbsp; &nbsp;<?php  echo $_SESSION["username_u"]; ?></span>
    </a>
   <li><a href="logout.php"><span class="edu-icon edu-locked author-log-ic"></span>Log Out</a></li>
</ul>
<br><br>
<header>
    <h1 align="center" style="color: slateblue;">Sorting Visualization</h1>
    <p style="color: black;font-size: 25px;" >
        The Sorting Visualization Technique helps you visualize three different sorting techniques.<br>
        <b>Bubble Sort , Selection Sort and Insertion Sort.</b> <br>

        <b style="color: indigo;">Instructions:</b><br>
        1. You can Generate a new array using the new array button.<br>
        2. Size of array can be increased and decreased through the slider.<br>
        3. Speed is also changable through the spped slider.<br>
        4. Respective sorting buttons performs respective sorting methods.<br>
        5. Green bars mean that that part of the array has been sorted.<br>
        6. Once array starts it's sorting method, all other buttons are disabled to avoid  <br>random changes
        in between the sorting process.<br>
        7. Help visualize the three sorting techniques to help learn the methods better.<br>

    </p>
    <br><br>
    <nav style="background-color: lavender;">
        <div class="row">
            
                <button type="button" class="newArray" id="newArray">New Array</button>
           
            <div class="col" id="input">
                <span id="size" style="color: dodgerblue;">Size
                    <input id="arr_sz" type="range" min="5" max="100" step=1 value=60>
                </span>
                <span id="speed" style="color: dodgerblue;">Speed
                    <input id="speed_input" type="range" min="20" max="300" stepDown=10 value=60>
                </span>
            </div>
            <div align="right">
                <button type="button" class="bubbleSort" id="bubbleSort">Bubble Sort</button>
                <button type="button" class="selectionSort" id="selectionSort">Selection Sort</button>
                <button type="button" class="insertionSort" id="insertionSort">Insertion Sort</button>
            </div>
        </div>
    </nav>
</header>

<body class="p-3 mb-2 bg-dark text-white">
    
    <div id="bars" class="flex-container" style="background-color: lavender;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
    <script src="sorting.js"></script>
    <script src="bubble_sort.js"></script>
    <script src="insertion_sort.js"></script>
    <script src="selection_sort.js"></script>
</body>
<style type="text/css">
#newArray{
    width: 180px;
  background-color: #3399ff;
  border: none;
  color: white;
  padding: 15px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
#bubbleSort,#selectionSort,#insertionSort{
    width: 100px;
  background-color: #3399ff;
  border: none;
  color: white;
  padding: 15px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}
    ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 75px;
    }

    li {
    float: left;

    }

li:last-child {
    border-right: none;
    }

    li a {
    display: block;
    color: black;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    height: 60px;
    font-size: 23px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }
    
    li a:hover:not(.active) {
    color:orange;
    }

</style>
</html>