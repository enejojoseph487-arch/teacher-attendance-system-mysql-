-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: attendance_system
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int NOT NULL,
  `date` date NOT NULL,
  `sign_in` time DEFAULT NULL,
  `sign_out` time DEFAULT NULL,
  `status` enum('Present','Absent') DEFAULT 'Present',
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (25,2,'2026-09-03','21:36:52','21:37:07','Present'),(26,19,'2026-09-03','21:50:04','21:52:22','Present'),(27,2,'2026-09-04','12:27:00','12:27:49','Present'),(28,19,'2026-09-04','12:36:22','12:37:25','Present'),(29,21,'2026-09-04','16:49:43',NULL,'Present'),(30,21,'2026-09-06','14:49:46','14:55:03','Present'),(31,23,'2026-09-06','15:09:09',NULL,'Present'),(32,1,'2026-09-07','11:31:26','11:31:52','Present'),(33,22,'2026-09-07','11:38:35',NULL,'Present'),(34,23,'2026-09-07','11:40:19',NULL,'Present'),(35,23,'2026-09-08','10:29:56',NULL,'Present'),(36,23,'2026-09-15','12:30:31','12:30:41','Present');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('teacher','admin') DEFAULT 'teacher',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@gmail.com','$2b$10$ri09/brnLlKQfCDGZhva9uTRSUz.oEpSFYgypg7Gj1SdEktmWiO9O','admin'),(2,'John Teacher','teacher@gmail.com','$2b$10$14DT02LX0XjbHl48DNGW7esaNuufvWx2R9jmrYac3phF9F5plmm6O','teacher'),(19,'enejo Teacher','enejo@gmail.com','$2b$10$14DT02LX0XjbHl48DNGW7esaNuufvWx2R9jmrYac3phF9F5plmm6O','teacher'),(21,'testimony','testimony@gmail.com','$2b$10$P7Bp7aPXuseVenozT9MHbu0PabSnHBvrs1Wp5oX7CTJXZp7Co0UL.','teacher'),(22,'destiny','destiny@gmail.com','$2b$10$ZEthhvo5BWzqlZVYXUaf/uVqPPQngl.HEGiC6erEBrpl.w4o1WJU.','teacher'),(23,'joseph','joseph@gmail.com','$2b$10$EHJpm.a2UjwW70n4nvI9COmKEtrSo4wg52osO0GoCHv/6FcqFd98G','teacher');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-30 14:01:31
