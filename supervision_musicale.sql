-- MySQL dump 10.13  Distrib 8.4.7, for Linux (x86_64)
--
-- Host: localhost    Database: supervision_musicale
-- ------------------------------------------------------
-- Server version	8.4.7-0ubuntu0.25.04.2

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
-- Table structure for table `alertes`
--

DROP TABLE IF EXISTS `alertes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alertes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lecteur_id` text,
  `type` text NOT NULL,
  `message` text NOT NULL,
  `resolue` tinyint DEFAULT '0',
  `cree_le` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alertes`
--

LOCK TABLES `alertes` WRITE;
/*!40000 ALTER TABLE `alertes` DISABLE KEYS */;
/*!40000 ALTER TABLE `alertes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diffusions`
--

DROP TABLE IF EXISTS `diffusions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diffusions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lecteur_id` text NOT NULL,
  `type` enum('musique','pub','urgent') NOT NULL,
  `titre` text NOT NULL,
  `debut` timestamp NOT NULL,
  `fin` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diffusions`
--

LOCK TABLES `diffusions` WRITE;
/*!40000 ALTER TABLE `diffusions` DISABLE KEYS */;
/*!40000 ALTER TABLE `diffusions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecteurs`
--

DROP TABLE IF EXISTS `lecteurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecteurs` (
  `id` varchar(50) NOT NULL,
  `nom` text NOT NULL,
  `ip` char(15) NOT NULL,
  `statut` enum('UP','KO') DEFAULT 'KO',
  `derniere_vue` timestamp NULL DEFAULT NULL,
  `playlist_version` int DEFAULT '0',
  `cree_le` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecteurs`
--

LOCK TABLES `lecteurs` WRITE;
/*!40000 ALTER TABLE `lecteurs` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecteurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages_urgents`
--

DROP TABLE IF EXISTS `messages_urgents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages_urgents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contenu` text NOT NULL,
  `lecteur_id` text,
  `envoye_par` int NOT NULL,
  `envoye_le` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `statut` enum('envoye','lu','erreur') DEFAULT 'envoye',
  PRIMARY KEY (`id`),
  KEY `envoye_par` (`envoye_par`),
  CONSTRAINT `messages_urgents_ibfk_1` FOREIGN KEY (`envoye_par`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages_urgents`
--

LOCK TABLES `messages_urgents` WRITE;
/*!40000 ALTER TABLE `messages_urgents` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages_urgents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlist`
--

DROP TABLE IF EXISTS `playlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` text NOT NULL,
  `fichier` text NOT NULL,
  `type` enum('musique','pub') NOT NULL,
  `ordre` int NOT NULL,
  `version` int NOT NULL DEFAULT '1',
  `duree_sec` int DEFAULT NULL,
  `actif` tinyint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlist`
--

LOCK TABLES `playlist` WRITE;
/*!40000 ALTER TABLE `playlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` text NOT NULL,
  `email` text NOT NULL,
  `mot_de_passe` text NOT NULL,
  `role` enum('it','commercial','retail') NOT NULL,
  `cree_le` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'fouss','fouss.test@example.com','$2y$12$vcx3Dv4Yu.sz3v/l.PyineLea4PD2WK7UdD9g8JJ5t6W/vdVpujOu','it','2026-05-31 12:13:05'),(2,'clem','clem@example.com','$2y$12$VnHwCK7nZHz2XqKJWmBGouED5HHMKPMpKwesQQKHcFzKs.B5Y4086','commercial','2026-05-31 12:27:04'),(3,'fouss','fouss.test@example.com','$2y$12$6dAkJebtCARSbZ4Oc1cRS.Eg7WGc.gGub79qE9x5w4s5Q4ubuAEIC','it','2026-05-31 14:19:14'),(4,'commercial','commercial@example.com','$2y$12$bk.oN8K.cmkSYgVd1dNLzOXeuiYJXB/IAz2DAHHFmgXmADHqxUY9S','commercial','2026-05-31 14:41:38');
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

-- Dump completed on 2026-06-01 17:54:01
