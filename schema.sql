-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Erstellungszeit: 16. Sep 2017 um 12:12
-- Server-Version: 5.7.19
-- PHP-Version: 7.0.21

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `travenas`
--
CREATE DATABASE IF NOT EXISTS `travenas` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `travenas`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `connections`
--

DROP TABLE IF EXISTS `connections`;
CREATE TABLE IF NOT EXISTS `connections` (
  `connectionid` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) DEFAULT NULL,
  `fromDest` varchar(255) DEFAULT NULL,
  `toDest` varchar(255) DEFAULT NULL,
  `depart` varchar(255) DEFAULT NULL,
  `arrival` varchar(255) DEFAULT NULL,
  `finished` tinyint(1) NOT NULL DEFAULT '0',
  `endStation` varchar(255) NOT NULL,
  `ranking` float NOT NULL,
  PRIMARY KEY (`connectionid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `score`
--

DROP TABLE IF EXISTS `score`;
CREATE TABLE IF NOT EXISTS `score` (
  `scoreid` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) NOT NULL,
  `score` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`scoreid`),
  UNIQUE KEY `userIdx` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sections`
--

DROP TABLE IF EXISTS `sections`;
CREATE TABLE IF NOT EXISTS `sections` (
  `sectionid` int(11) NOT NULL AUTO_INCREMENT,
  `connection` int(11) NOT NULL,
  `fromStation` varchar(255) DEFAULT NULL,
  `toStation` varchar(255) DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`sectionid`),
  KEY `connection` (`connection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`connection`) REFERENCES `connections` (`connectionid`) ON DELETE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
