<?php
session_start();
include "header.php";
include "../connection.php";
if(!isset($_SESSION["admin"]))
{
    ?>
<script type = "text/javascript">
window.location="index.php";
</script>
    <?php
}
?>

       

        <div class="breadcrumbs">
            <div class="col-sm-4">
                <div class="page-header float-left">
                    <div class="page-title">
                        <h1>All Exam Results</h1>
                    </div>
                </div>
            </div>
           
        </div>

        <div class="content mt-3">
            <div class="animated fadeIn">


                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            
                            <div class="card-body">
                            <br><br>
            <center>
            <h1> All EXAM RESULTS </h1><br> 
            </center>
             <?php
             $count = 0;
            $res = mysqli_query($link,"select * from exam_results order by id desc");
            $count = mysqli_num_rows($res);

            if($count == 0)
            {
                ?>
 <center>
            <h1> No Results Found </h1>
            </center>
                <?php
            }
else{

    echo "<table class = 'table table-bordered'>";
echo "<tr style = 'background-color:#cc99ff'>";
echo "<th>"; echo "username"; echo "</th>";
echo "<th>"; echo "exam_type"; echo "</th>";
echo "<th>"; echo "total_questions"; echo "</th>";
echo "<th>"; echo "correct_answer"; echo "</th>";
echo "<th>";  echo "wrong_answer"; echo "</th>";
echo "<th>"; echo "exam time"; echo "</th>";
echo "</tr>";

while($row = mysqli_fetch_array($res))
{
    echo "<tr>";
    echo "<td>"; echo $row["username"]; echo "</td>";
    echo "<td>"; echo $row["exam_type"]; echo "</td>";
    echo "<td>"; echo $row["total_question"]; echo "</td>";
    echo "<td>"; echo $row["correct_answer"]; echo "</td>";
    echo "<td>"; echo $row["wrong_answer"]; echo "</td>";
    echo "<td>"; echo $row["exam_time"]; echo "</td>";
    echo "</tr>";

}


    echo "</table>";
}
             ?>
                                
                            </div>
                        </div> <!-- .card -->

                    </div>
                    <!--/.col-->

                    
</div>
                                        </div><!-- .animated -->
                                    </div><!-- .content -->
                                </div><!-- /#right-panel -->
                                <!-- Right Panel -->
<?php
include "footer.php";
?>