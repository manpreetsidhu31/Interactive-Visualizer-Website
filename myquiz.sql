-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 24, 2021 at 05:13 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myquiz`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_login`
--

CREATE TABLE `admin_login` (
  `id` int(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin_login`
--

INSERT INTO `admin_login` (`id`, `username`, `password`) VALUES
(1, 'tanaya', 'tanaya23');

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(200) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `phno` varchar(500) NOT NULL,
  `msg` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `name`, `email`, `subject`, `phno`, `msg`) VALUES
(12, 'Manasi Kamath', 'manasi.kamath927@gmail.com', 'I want to know more about your website', '9223214975', 'Pls guide me through your website!!'),
(13, 'Manpreet Sidhhu', 'manusid2001@gmail.com', 'How can i view the visualizations?', '8379802925', 'i want to see visualizations'),
(14, 'Tanaya Naik', 'tanayanaik23@gmail.com', 'Enquiry', '9421663167', 'Basic Enquiry');

-- --------------------------------------------------------

--
-- Table structure for table `exam_category`
--

CREATE TABLE `exam_category` (
  `id` int(50) NOT NULL,
  `category` varchar(100) NOT NULL,
  `exam_time_in_minutes` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `exam_category`
--

INSERT INTO `exam_category` (`id`, `category`, `exam_time_in_minutes`) VALUES
(6, 'Insertion Sort', '10'),
(7, 'Bubble Sort', '7'),
(8, 'Selection Sort', '7'),
(9, 'Stack ', '10'),
(10, 'Queue', '5'),
(11, 'Dijikstra’s algorithm', '5'),
(12, 'Binary Search Tree', '10');

-- --------------------------------------------------------

--
-- Table structure for table `exam_results`
--

CREATE TABLE `exam_results` (
  `id` int(100) NOT NULL,
  `username` varchar(200) NOT NULL,
  `exam_type` varchar(200) NOT NULL,
  `total_question` varchar(200) NOT NULL,
  `correct_answer` varchar(200) NOT NULL,
  `wrong_answer` varchar(200) NOT NULL,
  `exam_time` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `exam_results`
--

INSERT INTO `exam_results` (`id`, `username`, `exam_type`, `total_question`, `correct_answer`, `wrong_answer`, `exam_time`) VALUES
(19, 'tan', 'Stack', '11', '8', '3', '2021-06-25'),
(23, 'tan', 'Queue', '5', '2', '3', '2021-06-26'),
(24, 'tan', 'Bubble Sort', '5', '2', '3', '2021-06-26'),
(34, 'tan', 'Selection Sort', '5', '2', '3', '2021-07-13'),
(36, 'prerna', 'Selection Sort', '5', '3', '2', '2021-07-14'),
(37, 'Manasi', 'Dijikstra’s algorithm', '4', '2', '2', '2021-07-22'),
(38, 'prerna', 'Stack', '11', '3', '8', '2021-07-22'),
(40, 'Nikita', 'Bubble Sort', '5', '3', '2', '2021-07-23'),
(46, 'Nikita', 'Dijikstra’s algorithm', '4', '2', '2', '2021-07-24'),
(47, 'Nikita', 'Stack', '11', '8', '3', '2021-07-24'),
(48, 'Nikita', 'Binary Search Tree', '7', '4', '3', '2021-07-24'),
(49, 'Atharva', 'Insertion Sort', '7', '5', '2', '2021-07-24'),
(50, 'Atharva', 'Bubble Sort', '5', '1', '4', '2021-07-24'),
(51, 'Atharva', 'Queue', '5', '4', '1', '2021-07-24'),
(52, 'Lalit', 'Binary Search Tree', '7', '1', '6', '2021-07-24'),
(53, 'Lalit', 'Insertion Sort', '7', '6', '1', '2021-07-24'),
(54, 'Lalit', 'Selection Sort', '5', '1', '4', '2021-07-24'),
(55, 'Lalit', 'Stack', '11', '7', '4', '2021-07-24');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(50) NOT NULL,
  `question_no` varchar(100) NOT NULL,
  `question` varchar(100) NOT NULL,
  `opt1` varchar(100) NOT NULL,
  `opt2` varchar(100) NOT NULL,
  `opt3` varchar(100) NOT NULL,
  `opt4` varchar(100) NOT NULL,
  `answer` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `question_no`, `question`, `opt1`, `opt2`, `opt3`, `opt4`, `answer`, `category`) VALUES
(18, '1', 'How many passes does an insertion sort algorithm consist of?', 'N', 'N-1', 'N+1', 'N*2', 'N-1', 'Insertion Sort'),
(19, '2', 'Any algorithm that sorts by exchanging adjacent elements require O(N2) on average.', 'True', 'False', 'None of the mention', 'maybe true or maybe false', 'True', 'Insertion Sort'),
(20, '3', 'What will be the number of passes to sort the elements using insertion sort? 14, 12,16, 6, 3, 10', '6', '7', '5', '1', '5', 'Insertion Sort'),
(21, '4', 'Which of the following sorting algorithms is the fastest for sorting small arrays?', 'Quick sort', 'Shell sort', 'Heap sort', 'Insertion sort', 'Insertion sort', 'Insertion Sort'),
(22, '5', 'For the best case input, the running time of an insertion sort algorithm is?', 'Linear', 'Binary', 'Quadratic', ' Depends on the input', 'Linear', 'Insertion Sort'),
(23, '6', 'Which of the following examples represent the worst case input for an insertion sort?', 'array in sorted order', 'normal unsorted array', 'array sorted in reverse order', ' large array', 'array sorted in reverse order', 'Insertion Sort'),
(24, '7', 'In C, what are the basic loops required to perform an insertion sort?', 'for and while', 'do- while', 'for and if', 'if else', 'for and while', 'Insertion Sort'),
(25, '1', 'What is the average case complexity of bubble sort?', 'O(nlogn)', ' O(logn)', ' O(n)', 'O(n^2)', 'O(n^2)', 'Bubble Sort'),
(26, '2', 'Select the appropriate code that performs bubble sort.', 'opt_images/6ecb29714bf6ff647d833623520617b7bs1.jpg', 'opt_images/e6a1d1a1d71df7741e376aefd67fc5fabs2.jpg', 'opt_images/e6a1d1a1d71df7741e376aefd67fc5fabs3.jpg', 'opt_images/e6a1d1a1d71df7741e376aefd67fc5fabs4.jpg', 'opt_images/e6a1d1a1d71df7741e376aefd67fc5fabs1.jpg', 'Bubble Sort'),
(27, '3', ' The given array is arr = {1, 2, 4, 3}. Bubble sort is used to sort the array elements. How many ite', '2', '1', '0', '4', '4', 'Bubble Sort'),
(29, '4', 'How can you improve the best case efficiency in bubble sort? (The input is already sorted)', 'opt_images/e2300c65bab84ab58a9290aaea13b107bs2 1.jpg', 'opt_images/e2300c65bab84ab58a9290aaea13b107bs2 2.jpg', 'opt_images/e2300c65bab84ab58a9290aaea13b107bs2 3.jpg', 'opt_images/e2300c65bab84ab58a9290aaea13b107bs2 4.jpg', 'opt_images/e2300c65bab84ab58a9290aaea13b107bs2 3.jpg', 'Bubble Sort'),
(30, '5', 'What is the worst case complexity of bubble sort?', 'O(nlogn)', ' O(logn)', 'O(n)', ' O(n^2)', ' O(n^2)', 'Bubble Sort'),
(31, '1', ' What is the worst case complexity of selection sort?', 'O(nlogn)', ' O(logn)', 'O(n)', 'O(n^2)', 'O(n^2)', 'Selection Sort'),
(32, '2', 'Select the appropriate code that performs selection sort.', 'opt_images/1c3e7ddf4bcb202f19a7fb9b5c03b03dss1.jpg', 'opt_images/1c3e7ddf4bcb202f19a7fb9b5c03b03dss2.jpg', 'opt_images/1c3e7ddf4bcb202f19a7fb9b5c03b03dss3.jpg', 'opt_images/1c3e7ddf4bcb202f19a7fb9b5c03b03dss4.jpg', 'opt_images/1c3e7ddf4bcb202f19a7fb9b5c03b03dss1.jpg', 'Selection Sort'),
(33, '3', 'What is the best case complexity of selection sort?', 'O(nlogn)', 'O(logn)', 'O(n)', 'O(n^2)', 'O(n^2)', 'Selection Sort'),
(34, '4', 'Consider a situation where swap operation is very costly. Which of the following sorting algorithms ', 'Heap Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort', 'Selection Sort'),
(35, '5', 'Which is the correct order of the following algorithms with respect to their time Complexity in the ', 'Merge sort > Quick sort >Insertion sort > selection sort', 'Merge sort > selection sort > quick sort > insertion sort', 'Merge sort > Quick sort > selection sort > insertion sort', 'insertion sort < Quick sort < Merge sort < selection sort', 'insertion sort < Quick sort < Merge sort < selection sort', 'Selection Sort'),
(36, '1', 'Process of inserting an element in stack is called ____________', 'Create', 'Push', 'Evaluation ', 'Pop', 'Push', 'Stack '),
(37, '2', 'In a stack, if a user tries to remove an element from an empty stack it is called _________', ' Empty collection', 'Garbage Collection', 'Underflow', 'Overflow', 'Underflow', 'Stack '),
(38, '3', 'Process of removing an element from stack is called __________', 'Push', 'Pop', 'Create', 'Evaluation', 'Pop', 'Stack '),
(39, '4', 'Pushing an element into stack already having five elements and stack size of 5, then stack becomes _', 'Crash', 'Underflow', ' User flow', 'Overflow', 'Overflow', 'Stack '),
(40, '5', 'What is the value of the postfix expression 6 3 2 4 + – *?', '1', '14', '74', '-18', '-18', 'Stack '),
(41, '6', 'The data structure required to check whether an expression contains a balanced parenthesis is?', 'Stack', 'Queue', 'Array', ' Tree', 'Stack', 'Stack '),
(42, '7', 'The postfix form of A*B+C/D is?', 'AB*CD/+', '*AB/CD+', 'A*BC+/D', 'ABCD+/*', 'AB*CD/+', 'Stack '),
(43, '8', ' The result of evaluating the postfix expression 5, 4, 6, +, *, 4, 9, 3, /, +, * is?', '600', ' 350', ' 650', '588', '350', 'Stack '),
(44, '9', 'The type of expression in which operator succeeds its operands is?', ' Infix Expression', 'Prefix Expression', 'Postfix Expression', 'Both Prefix and Postfix Expressions', 'Postfix Expression', 'Stack '),
(45, '10', ' If the elements “A”, “B”, “C” and “D” are placed in a stack and are deleted one at a time, what is ', 'ABCD', 'DCAB', ' ABDC', 'DCBA', 'DCBA', 'Stack '),
(46, '11', 'Which of the following is not an inherent application of stack?', 'Reversing a string', 'Evaluation of postfix expression', 'Implementation of recursion', 'Job scheduling', 'Job scheduling', 'Stack '),
(47, '1', 'A linear list of elements in which deletion can be done from one end (front) and insertion can take ', 'Stack', 'Queue', 'Linked List', 'Sort', 'Queue', 'Queue'),
(48, '2', 'A queue follows __________', 'FIFO (First In First Out) principle', ' Ordered array', 'Linear tree', 'LIFO (Last In First Out) principle', 'FIFO (First In First Out) principle', 'Queue'),
(49, '3', 'Circular Queue is also known as ________', 'Square Buffer', 'Rectangle Buffer', 'Ring Buffer', 'Curve Buffer', 'Ring Buffer', 'Queue'),
(50, '4', 'One difference between queue and stack is :', 'Queue requires dynamic memory , but stacks do not.', 'Stack requires dynamic memory , but queues do not.', 'Queues use two ends of the structure , stacks use only one.', 'Stacks use two ends of the structure , queues use only one.', 'Queues use two ends of the structure , stacks use only one.', 'Queue'),
(51, '5', 'What is the worst case time complexity of a sequence of n queue operations on an initially empty que', 'θ (n)', 'θ (n + k)', 'θ (nk)', 'θ (n^2)', 'θ (n)', 'Queue'),
(52, '1', 'What is the time complexity of Dijikstra’s algorithm?', 'O(N)', 'O(N^3)', 'O(N^2)', 'O(logN)', 'O(N^2)', 'Dijikstra’s algorithm'),
(53, '2', 'How many priority queue operations are involved in Dijkstra’s Algorithm?', '1', '3', '2', '4', '3', 'Dijikstra’s algorithm'),
(54, '3', 'Dijkstra’s Algorithm is used to solve _____________ problems.', 'All pair shortest path', 'Network flow', 'Sorting', 'Single source shortest path', 'Single source shortest path', 'Dijikstra’s algorithm'),
(55, '4', 'Dijkstra’s Algorithm cannot be applied on ______________', 'Directed and weighted graphs', 'Unweighted graphs', 'Undirected and unweighted graphs', ' Graphs having negative weight function', ' Graphs having negative weight function', 'Dijikstra’s algorithm'),
(56, '1', 'What is the worst case time complexity for search, insert and delete operations in a general Binary ', 'O(Logn) for all', 'O(Logn) for search and insert, and O(n) for delete', 'O(n) for all', 'O(Logn) for search, and O(n) for insert and delete', 'O(n) for all', 'Binary Search Tree'),
(57, '2', 'How many distinct binary search trees can be created out of 4 distinct keys?', '4', '42', '24', '14', '14', 'Binary Search Tree'),
(58, '3', 'Suppose the numbers 7, 5, 1, 8, 3, 6, 0, 9, 4, 2 are inserted in that order into an initially empty ', '7 5 1 0 3 2 4 6 8 9', '0 2 4 3 1 6 5 9 8 7', '0 1 2 3 4 5 6 7 8 9', '9 8 6 4 2 3 0 1 5 7', '0 1 2 3 4 5 6 7 8 9', 'Binary Search Tree'),
(59, '4', 'The following numbers are inserted into an empty binary search tree in the given order: 10, 1, 3, 5,', '2', '3', '4', '6', '3', 'Binary Search Tree'),
(60, '5', 'Which of the following is false about a binary search tree?', ' The left child is always lesser than its parent', 'The right child is always greater than its parent', 'The left and right sub-trees should also be binary search trees', ' In order sequence gives decreasing order of elements', ' In order sequence gives decreasing order of elements', 'Binary Search Tree'),
(61, '6', 'How to search for a key in a binary search tree?', 'opt_images/2b57877edb0c38dc483bb28467d16b45bst1.jpg', 'opt_images/2b57877edb0c38dc483bb28467d16b45bst2.jpg', 'opt_images/2b57877edb0c38dc483bb28467d16b45bst3.jpg', 'opt_images/2b57877edb0c38dc483bb28467d16b45bst4.jpg', 'opt_images/2b57877edb0c38dc483bb28467d16b45bst1.jpg', 'Binary Search Tree'),
(62, '7', 'How will you find the minimum element in a binary search tree?', 'opt_images/24d11a028ce0c4fba3dec9e4fecf3178bst 2 1.jpg', 'opt_images/24d11a028ce0c4fba3dec9e4fecf3178bst 2 2.jpg', 'opt_images/24d11a028ce0c4fba3dec9e4fecf3178bst 2 3.jpg', 'opt_images/24d11a028ce0c4fba3dec9e4fecf3178bst 2 4.jpg', 'opt_images/24d11a028ce0c4fba3dec9e4fecf3178bst 2 1.jpg', 'Binary Search Tree'),
(64, '1', 'which is avl ?', 'opt_images/f207ee753045552feedafab9a11a1e401.png', 'opt_images/f207ee753045552feedafab9a11a1e402.png', 'opt_images/f207ee753045552feedafab9a11a1e403.png', 'opt_images/f207ee753045552feedafab9a11a1e404.png', 'opt_images/f207ee753045552feedafab9a11a1e404.png', 'php'),
(65, '1', 'What is an AVL tree?', 'a tree which is balanced and is a height balanced tree', 'a tree which is unbalanced and is a height balanced tree', 'a tree with three children', 'a tree with atmost 3 children', 'a tree with atmost 3 children', 'bst'),
(66, '2', 'who is jk from these', 'opt_images/8e474b1f5736ee28882ca5415a32a9b0bg-01.jpg', 'opt_images/3cdc56e033dd57387b02630095770b39bg-11.jpg', 'opt_images/3cdc56e033dd57387b02630095770b39bg-15.jpg', 'opt_images/3cdc56e033dd57387b02630095770b39bg-23.jpg', 'opt_images/6024047bf05e6bfd312aae25c9cb5f9b2109126.jpg', 'bst'),
(67, '1', 'what is correct?', 'opt_images/b56248350b14cf4bb943d43718bd25efbs1.jpg', 'opt_images/b56248350b14cf4bb943d43718bd25efbs2.jpg', 'opt_images/b56248350b14cf4bb943d43718bd25efbs3.jpg', 'opt_images/b56248350b14cf4bb943d43718bd25efbs4.jpg', 'opt_images/ccb953141c1dd91d082c71551e066381bs2.jpg', 'AVL bst');

-- --------------------------------------------------------

--
-- Table structure for table `registration`
--

CREATE TABLE `registration` (
  `id` int(50) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `birthday` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `registration`
--

INSERT INTO `registration` (`id`, `firstname`, `lastname`, `username`, `gender`, `birthday`, `password`, `email`, `contact`) VALUES
(1, 'Tanaya', 'Naik', 'tan', 'female', '23-02-2003', 'tan1234*', 'tanayanaik23@gmail.com', '9421663167'),
(4, 'Prerna', 'Jagnade', 'prerna', 'Female', '2000-11-29', 'prerna', 'prernajagnade@gmail.com', '7030640505'),
(5, 'Prajakta', 'Joshi', 'Prajakta', 'Female', '2001-08-07', 'prajakta123', 'joshiprajakta@gmail.com', '8605035421'),
(6, 'Shreya', 'Ghoshal', 'Shreya', 'Female', '2004-07-14', 'shreya14', 'ghoshalsisters@hotmail.com', '8459678125'),
(8, 'Lalit', 'Mahajan', 'Lalit', 'Male', '2008-06-17', 'lalit123', 'mHjan@gmail.com', '7030640505'),
(9, 'Manali', 'Joshi', 'Manali', 'Female', '2010-06-23', 'manali123', 'manali@gmail.com', '874596157'),
(10, 'Manasi', 'Kamath', 'Manasi', 'Female', '2006-02-22', 'manasi14', 'kamathmanasi@gmail.com', '9822731642'),
(11, 'Nikita', 'Chavan', 'Nikita', 'Female', '2009-03-23', 'nikita123', 'nikita@gmail.com', '984567123'),
(12, 'Atharva', 'Naikno', 'Atharva', 'Female', '2006-06-23', 'atharva123', 'athu@gmail.com', '874512975');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_login`
--
ALTER TABLE `admin_login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam_category`
--
ALTER TABLE `exam_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam_results`
--
ALTER TABLE `exam_results`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registration`
--
ALTER TABLE `registration`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_login`
--
ALTER TABLE `admin_login`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `exam_category`
--
ALTER TABLE `exam_category`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `exam_results`
--
ALTER TABLE `exam_results`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `registration`
--
ALTER TABLE `registration`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
