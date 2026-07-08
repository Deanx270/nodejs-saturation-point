-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 08, 2026 at 02:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `the_saturation_point`
--
CREATE DATABASE IF NOT EXISTS `the_saturation_point` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `the_saturation_point`;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `origin`, `description`, `status`, `createdAt`, `updatedAt`) VALUES
('0d5462b3-b0b1-43c2-a993-b8ae4ca555e5', 'Rhodia', NULL, NULL, 'active', '2026-06-23 16:17:07', '2026-06-23 16:17:07'),
('153eef37-fb05-4c1a-b852-8e425511fd32', 'Montblanc', '', '', 'active', '2026-06-14 11:43:11', '2026-06-23 16:17:07'),
('1cc64188-bcf9-4c01-81e6-ffd430add2f1', 'Kaweco', NULL, NULL, 'active', '2026-06-23 16:17:07', '2026-06-23 16:17:07'),
('359dc040-ec19-4652-99dd-2b11e7f017b6', 'Sailor', NULL, NULL, 'active', '2026-06-23 16:17:07', '2026-06-23 16:17:07'),
('404e5888-f849-43c4-9d8e-0267137cd697', 'Tomoe', '', '', 'active', '2026-06-13 19:17:22', '2026-06-14 11:39:25'),
('45893d75-b351-4127-a3fc-6c8448a1d828', 'Pelikan', NULL, NULL, 'active', '2026-06-23 16:17:07', '2026-06-23 16:17:07'),
('4c54d265-9909-40d4-ba62-0cadcbb6ec35', 'TWSBI', NULL, NULL, 'active', '2026-06-23 16:17:07', '2026-06-23 16:17:07'),
('50ca69e7-0fdb-47ed-9fc5-45cd4dee2530', 'Visconti', NULL, NULL, 'active', '2026-06-23 16:17:07', '2026-06-23 16:17:07'),
('5125a0b3-283e-4629-8c51-615aa2b2d0a9', 'Lamy', NULL, NULL, 'active', '2026-06-23 16:17:07', '2026-06-23 16:17:07'),
('84822645-3e4a-4a93-a8a1-929938374786', 'Midori', NULL, NULL, 'active', '2026-06-23 16:17:07', '2026-06-23 16:17:07'),
('ab8dbd94-b063-4890-ad02-057874c26e4b', 'Diamine', 'England', '', 'active', '2026-06-23 16:17:07', '2026-07-03 16:07:54'),
('b10aed9a-279a-4c9d-9b96-7d5558394f9d', 'Pilot', NULL, NULL, 'active', '2026-06-23 16:17:07', '2026-06-23 16:17:07');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
('ink', 'Inks', 'High-quality fountain pen inks', '2026-06-14 13:23:10', '2026-06-14 14:05:50'),
('paper', 'Paper', 'Fountain-pen friendly paper', '2026-06-14 13:23:10', '2026-06-14 14:02:21'),
('pen', 'Fountain Pens', 'Premium writing instruments', '2026-06-14 13:23:10', '2026-06-14 13:23:10');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `images` text DEFAULT NULL,
  `categoryId` varchar(255) NOT NULL,
  `brandId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `images`, `categoryId`, `brandId`, `createdAt`, `updatedAt`) VALUES
('10d7dd51-13f0-4e88-a743-849b6efd5236', 'Kaweco Brass Sport', 'A heavyweight pocket pen that develops a unique patina over time.', 4500.00, 15, '[\"/images/default-avatar.png\"]', 'pen', '1cc64188-bcf9-4c01-81e6-ffd430add2f1', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('11edb57a-993f-4eec-ab66-b907eb3e0ce1', 'Diamine Earl Grey Ink 80ml', 'A beautiful shading grey ink chosen by the fountain pen community.', 950.00, 25, '[\"/images/default-avatar.png\"]', 'ink', 'ab8dbd94-b063-4890-ad02-057874c26e4b', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('163f1b31-9adc-41c3-b50a-f377d6897a7d', 'Pilot Vanishing Point Matte Black', 'A retractable fountain pen with an 18k gold nib, perfect for quick notes.', 9500.00, 11, '[\"/images/default-avatar.png\"]', 'pen', 'b10aed9a-279a-4c9d-9b96-7d5558394f9d', '2026-06-23 16:18:43', '2026-07-04 08:24:18'),
('1c553a51-314b-4534-9d26-a72061ff8994', 'Tomoe River 52gsm Notebook - A5 Dot Grid', 'An ultra-lightweight, fountain-pen-friendly A5 notebook featuring smooth, bleed-resistant 52gsm Tomoe River paper with a subtle dot grid layout.', 5000.00, 44, '[\"/images/uploads/product-1781378272223-916383188.png\",\"/images/uploads/product-1781378272192-128869646.png\",\"/images/uploads/product-1781378272270-50885532.png\"]', 'paper', '404e5888-f849-43c4-9d8e-0267137cd697', '2026-06-13 19:17:52', '2026-06-23 16:13:00'),
('1f36cf1f-5940-4822-b332-ced4dedf9099', 'Midori Traveler\'s Notebook Camel', 'A customizable leather cover notebook system that ages beautifully.', 2800.00, 10, '[\"/images/default-avatar.png\"]', 'paper', '84822645-3e4a-4a93-a8a1-929938374786', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('27f61cce-e34c-4201-9d9d-4997e5a3ca1f', 'Pelikan Souverän M800', 'The flagship piston filler with a brass mechanism and an exceptionally smooth 18k nib.', 32000.00, 3, '[\"/images/default-avatar.png\"]', 'pen', '45893d75-b351-4127-a3fc-6c8448a1d828', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('2a36eb5c-67fb-11f1-9e0b-54e1adc3251b', 'Majestic Gold Nib Pen', 'A stunning 18k gold nib fountain pen designed for executives.', 15000.00, 15, '[\"/images/uploads/product-1782231719861-928274810.png\"]', 'pen', '153eef37-fb05-4c1a-b852-8e425511fd32', '2026-06-14 22:13:06', '2026-06-23 16:21:59'),
('2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 'Obsidian Executive Fountain Pen', 'Sleek matte black finish with exceptional weight and balance.', 8500.00, 24, '[\"/images/uploads/product-1782231735186-28548354.png\"]', 'pen', '5125a0b3-283e-4629-8c51-615aa2b2d0a9', '2026-06-14 22:13:06', '2026-06-23 16:22:15'),
('2a37141d-67fb-11f1-9e0b-54e1adc3251b', 'Crimson Heritage Edition', 'Limited edition crimson resin body with gold accents.', 12400.00, 5, '[\"/images/uploads/product-1782231877395-814496783.png\"]', 'pen', '359dc040-ec19-4652-99dd-2b11e7f017b6', '2026-06-14 22:13:06', '2026-06-23 16:24:37'),
('2a37164e-67fb-11f1-9e0b-54e1adc3251b', 'Sapphire Ocean Pen', 'Deep blue translucent barrel showcasing inner ink mechanisms.', 9200.00, 30, '[\"/images/uploads/product-1782231889372-902292632.png\"]', 'pen', '45893d75-b351-4127-a3fc-6c8448a1d828', '2026-06-14 22:13:06', '2026-06-23 16:24:49'),
('2a39687a-747f-46e6-b881-ffd8cce8b11a', 'Pilot Custom 823 Fountain Pen', 'The Custom 823 is a premium fountain pen featuring a vacuum filling system and a 14k gold nib.', 16500.00, 29, '[\"/images/uploads/product-1781437444984-192990406.png\"]', 'pen', 'b10aed9a-279a-4c9d-9b96-7d5558394f9d', '2026-06-14 11:44:04', '2026-06-23 16:17:07'),
('323bc4e8-084c-419d-8016-843f10727e8d', 'Diamine Oxblood Ink 80ml', 'A rich, dark red fountain pen ink reminiscent of dried blood.', 950.00, 29, '[\"/images/default-avatar.png\"]', 'ink', 'ab8dbd94-b063-4890-ad02-057874c26e4b', '2026-06-23 16:18:43', '2026-07-04 08:29:37'),
('39745b6b-62f2-433a-b166-bd6ba43bf514', 'Pilot Iroshizuku Yama-budo 50ml', 'A rich crimson-purple ink reminiscent of wild mountain grapes.', 1800.00, 18, '[\"/images/default-avatar.png\"]', 'ink', 'b10aed9a-279a-4c9d-9b96-7d5558394f9d', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('40da4d0a-4fa2-4716-ade4-e671e1a64b2b', 'Lamy 2000 Fountain Pen', 'A timeless classic of modern design, featuring a fiberglass body and 14k gold nib.', 11500.00, 8, '[\"/images/uploads/product-1783153346784-86678538.png\",\"/images/uploads/product-1783153346774-572809156.png\",\"/images/uploads/product-1783153346798-847176714.png\"]', 'pen', '5125a0b3-283e-4629-8c51-615aa2b2d0a9', '2026-06-23 16:18:43', '2026-07-07 10:51:20'),
('489e7aa0-c033-4b8e-909d-8d604490ff02', 'Sailor Shikiori Yamadori 20ml', 'A beautiful teal ink with incredible red sheen.', 850.00, 20, '[\"/images/default-avatar.png\"]', 'ink', '359dc040-ec19-4652-99dd-2b11e7f017b6', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('6903c6eb-76a9-44f0-86ec-6c0b78790b6b', 'TWSBI Diamond 580 ALR', 'A premium demonstrator with aluminum grip and piston mechanism.', 4200.00, 20, '[\"/images/default-avatar.png\"]', 'pen', '4c54d265-9909-40d4-ba62-0cadcbb6ec35', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('8fe09851-424c-4268-8228-9b49f4a5b37d', 'Midori MD Notebook A5 Grid', 'Minimalist Japanese notebook featuring excellent bleed-resistant paper.', 850.00, 40, '[\"/images/default-avatar.png\"]', 'paper', '84822645-3e4a-4a93-a8a1-929938374786', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('9abf7e22-8472-4844-879a-6b785b295837', 'Rhodia Webnotebook A5 Dot Grid', 'Premium 90gsm ivory paper that is exceptionally fountain pen friendly.', 1200.00, 35, '[\"/images/default-avatar.png\"]', 'paper', '0d5462b3-b0b1-43c2-a993-b8ae4ca555e5', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('9fb06125-a1ba-4aca-a8c2-4a0e530ff9fb', 'Lamy Safari Charcoal', 'The perfect starter fountain pen with an ergonomic grip.', 1800.00, 45, '[\"/images/default-avatar.png\"]', 'pen', '5125a0b3-283e-4629-8c51-615aa2b2d0a9', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('a3b00127-1b14-44b5-b12b-0d1e3755d3dd', 'Sailor Pro Gear Imperial Black', 'A stunning matte black fountain pen with ruthenium trims and a 21k gold nib.', 18000.00, 5, '[\"/images/default-avatar.png\"]', 'pen', '359dc040-ec19-4652-99dd-2b11e7f017b6', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('ae3ef57a-b6aa-4d87-857f-803c14482594', 'Pilot Iroshizuku Kon-peki 50ml', 'A vibrant, cerulean blue ink inspired by the color of a deep azure sky.', 1800.00, 15, '[\"/images/default-avatar.png\"]', 'ink', 'b10aed9a-279a-4c9d-9b96-7d5558394f9d', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('bc724a5f-5df8-4184-887d-1807793d9bc5', 'TWSBI Eco Clear', 'An affordable, high-capacity piston filler demonstrator.', 2100.00, 50, '[\"/images/default-avatar.png\"]', 'pen', '4c54d265-9909-40d4-ba62-0cadcbb6ec35', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('bd3b8a26-9309-4932-8557-0d23a7b76dba', 'Sailor 1911 Standard Black', 'A classic cigar-shaped fountain pen with a legendary 14k gold nib.', 11000.00, 8, '[\"/images/default-avatar.png\"]', 'pen', '359dc040-ec19-4652-99dd-2b11e7f017b6', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('ca933d53-2e9a-477d-bacb-3bb11bd08f4c', 'Kaweco Sport Classic Black', 'A pocket-sized icon that transforms into a full-sized pen when posted.', 1500.00, 40, '[\"/images/default-avatar.png\"]', 'pen', '1cc64188-bcf9-4c01-81e6-ffd430add2f1', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('d8a25f61-ae70-4865-b21e-360a09e83a8d', 'Pelikan Edelstein Aquamarine 50ml', 'A premium gemstone ink in a stunning blue-green shade.', 1400.00, 10, '[\"/images/default-avatar.png\"]', 'ink', '45893d75-b351-4127-a3fc-6c8448a1d828', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('e2716614-62d1-4e90-8b47-e4a47d4cb096', 'Montblanc Meisterstück 149', 'The ultimate symbol of writing excellence, featuring a hand-crafted 18k gold nib.', 55000.00, 4, '[\"/images/default-avatar.png\"]', 'pen', '153eef37-fb05-4c1a-b852-8e425511fd32', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('f0ca7f92-f2ad-489f-b832-fd51624eb8c0', 'Rhodia DotPad No. 16', 'The classic top-staple bound notepad with 80gsm coated paper.', 450.00, 60, '[\"/images/default-avatar.png\"]', 'paper', '0d5462b3-b0b1-43c2-a993-b8ae4ca555e5', '2026-06-23 16:18:43', '2026-06-23 16:18:43'),
('fb7d9d57-8885-4250-b150-b780b3583370', 'Visconti Homo Sapiens Bronze Age', 'Forged from Mount Etna basaltic lava, featuring solid bronze trims and an 18k nib.', 45000.00, 2, '[\"/images/default-avatar.png\"]', 'pen', '50ca69e7-0fdb-47ed-9fc5-45cd4dee2530', '2026-06-23 16:18:43', '2026-06-23 16:18:43');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `productId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `rating`, `comment`, `userId`, `productId`, `createdAt`, `updatedAt`) VALUES
('0f713b37-b039-48db-b8ad-e46e4ee3223d', 2, 'Sonion', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', '2a39687a-747f-46e6-b881-ffd8cce8b11a', '2026-06-14 15:46:33', '2026-06-14 15:46:33'),
('a0043743-4c4f-4e01-b96a-d469af173efc', 1, '******', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', '1c553a51-314b-4534-9d26-a72061ff8994', '2026-06-23 14:30:52', '2026-06-24 00:34:22'),
('e67aa9fa-1b67-4e3b-abee-4fa66a37ad8e', 5, 'damn *******\ntest', '6d2c1b0d-06bd-44d9-91c6-82f15bd91b3a', '1c553a51-314b-4534-9d26-a72061ff8994', '2026-06-23 14:34:47', '2026-06-23 14:35:08');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `status` enum('pending','shipped','delivered','cancelled') DEFAULT 'pending',
  `paymentMethod` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `userId`, `totalAmount`, `status`, `paymentMethod`, `createdAt`, `updatedAt`) VALUES
('00c2448f-2823-4bf1-8759-d15234decbae', '6d2c1b0d-06bd-44d9-91c6-82f15bd91b3a', 20150.00, 'delivered', 'Cash on Delivery', '2026-06-23 14:33:20', '2026-06-23 14:33:53'),
('21249c8f-3a38-465b-b321-1ff338dfd32d', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 40550.00, 'delivered', 'Cash on Delivery', '2026-01-05 15:46:01', '2026-06-23 15:46:01'),
('214213cb-1c43-435b-bae5-7bc967d34493', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 22550.00, 'delivered', 'PayPal', '2026-05-19 15:46:01', '2026-06-23 15:46:01'),
('2851b94e-8a9f-494f-87e4-d2f25466b570', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 21050.00, 'pending', 'Credit Card', '2026-06-02 15:46:01', '2026-06-23 15:46:01'),
('32fcb895-fc00-4c6f-9f4a-6b9e9cace5c3', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 9650.00, 'pending', 'Cash on Delivery', '2026-07-04 08:24:18', '2026-07-04 08:24:18'),
('3da2f14b-5460-4b3d-bcc5-dc1ee8f47e85', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 23650.00, 'shipped', 'Cash on Delivery', '2026-04-18 15:46:01', '2026-06-23 15:46:01'),
('415fb0a7-6324-4bdd-b657-ac724d9fcea3', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 59750.00, 'pending', 'PayPal', '2026-05-17 15:46:01', '2026-06-23 15:46:01'),
('4bb4575f-defb-482b-859a-e9a439673db9', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 22058.00, 'delivered', 'Cash on Delivery', '2026-06-14 12:56:28', '2026-06-14 12:56:42'),
('577cbb0f-1b1e-4bb8-bf07-c8af316b8ab4', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 28550.00, 'shipped', 'Credit Card', '2026-01-06 15:46:01', '2026-06-23 15:46:01'),
('5f07b35a-4858-4b82-b9af-ba9ee3bf56bf', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 15150.00, 'shipped', 'Credit Card', '2026-02-24 15:46:01', '2026-06-23 15:46:01'),
('61f97f6e-0288-4bcb-9d5d-cbef33bdd2b3', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 5150.00, 'delivered', 'Cash on Delivery', '2026-06-14 11:17:56', '2026-06-14 12:54:00'),
('63574e54-194d-44ff-a52c-7af6c554a057', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 5150.00, 'cancelled', 'Cash on Delivery', '2026-06-14 11:27:23', '2026-06-14 12:21:43'),
('6c229c0c-4a15-4d30-84fe-1972c0e3cc10', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 15150.00, 'pending', 'PayPal', '2026-05-10 15:46:01', '2026-06-23 15:46:01'),
('72f018ec-ee24-44d5-86ef-9ab90ab41cd1', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 32550.00, 'delivered', 'Cash on Delivery', '2026-03-19 15:46:01', '2026-06-23 15:46:01'),
('7a37f2ea-6695-44a0-915a-c6b0664d3c8c', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 27750.00, 'cancelled', 'Credit Card', '2026-03-10 15:46:01', '2026-06-23 15:46:01'),
('7e496c0e-e824-4bb1-8dbb-bd33e153cc5b', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 18550.00, 'delivered', 'PayPal', '2026-06-13 15:46:01', '2026-06-23 15:46:02'),
('7f4aa656-db29-4b3d-bd0a-1eb26649968f', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 3604.00, 'delivered', 'Cash on Delivery', '2026-06-14 12:59:55', '2026-06-14 15:04:52'),
('80cbda24-fb7e-4862-ab3f-9171e5097735', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 35150.00, 'cancelled', 'PayPal', '2026-01-01 15:46:01', '2026-06-23 15:46:01'),
('8b9d3e9a-dbba-48c4-bda6-fbd0f3c5281b', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 10150.00, 'delivered', 'PayPal', '2026-06-09 15:46:01', '2026-06-24 02:11:28'),
('942b5175-dbae-4b82-ac18-444d18a03322', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 8650.00, 'cancelled', 'PayPal', '2026-02-02 15:46:01', '2026-06-23 15:46:01'),
('a5806a9c-155a-4cc0-9e7a-e96dd2f08c06', '6d2c1b0d-06bd-44d9-91c6-82f15bd91b3a', 11650.00, 'pending', 'Cash on Delivery', '2026-06-24 02:09:15', '2026-06-24 02:09:15'),
('a6df9cdd-a04a-4118-a527-401dc2cf8cf2', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 34150.00, 'pending', 'Credit Card', '2026-02-16 15:46:01', '2026-06-23 15:46:01'),
('ade5c75b-444b-4412-a22d-c1a67dce971c', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 34950.00, 'shipped', 'PayPal', '2026-04-21 15:46:01', '2026-06-23 15:46:01'),
('ae3e95d2-48e2-4602-b352-b09dcdbefd8a', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 1100.00, 'delivered', 'Cash on Delivery', '2026-07-04 08:29:37', '2026-07-04 08:30:20'),
('b0386729-19ee-4b6e-aec6-a65372e39d2d', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 8604.00, 'delivered', 'Cash on Delivery', '2026-06-14 11:44:14', '2026-06-14 12:40:34'),
('b2475bae-b271-4dc3-a17d-40e5e0d67a5f', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 9350.00, 'cancelled', 'Credit Card', '2026-03-03 15:46:01', '2026-06-23 15:46:01'),
('b4b007c0-60e1-4f73-be00-ff37755a8dc9', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 5150.00, 'pending', 'Cash on Delivery', '2026-06-14 15:03:29', '2026-06-14 15:03:29'),
('bccd03b4-ce7f-4aaf-a5f0-f8ad7b2cb153', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 12550.00, 'shipped', 'Credit Card', '2026-04-28 15:46:01', '2026-06-23 15:46:01'),
('be530640-bf72-42f0-b3c9-68f6d37bec21', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 17850.00, 'cancelled', 'PayPal', '2026-05-31 15:46:01', '2026-06-23 15:46:01'),
('bf9fa134-fea1-413c-8653-13a198d002a7', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 44950.00, 'pending', 'Credit Card', '2026-06-16 15:46:01', '2026-06-23 15:46:01'),
('c2d51105-3207-4685-bb1f-caf0e19a7abc', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 10150.00, 'cancelled', 'Cash on Delivery', '2026-06-14 11:13:52', '2026-06-14 12:54:50'),
('c518653f-348e-4666-b420-4655713f15ad', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 21050.00, 'delivered', 'PayPal', '2026-06-10 15:46:01', '2026-06-23 15:46:01'),
('c9cb49e6-ebba-4964-a8a8-986c2816d6db', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 41350.00, 'shipped', 'PayPal', '2026-01-04 15:46:01', '2026-06-23 15:46:01'),
('cfbcfc7a-3afd-4570-9c84-058cdb4987c1', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 15150.00, 'shipped', 'Cash on Delivery', '2026-02-15 15:46:01', '2026-06-23 15:46:01'),
('d9122248-be57-4702-bb9b-32c8ed94be97', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 26350.00, 'pending', 'Cash on Delivery', '2026-05-06 15:46:01', '2026-06-23 15:46:01'),
('dc0402c4-0b09-4844-987b-8f191b0bbf8c', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 3604.00, 'delivered', 'Cash on Delivery', '2026-06-14 15:25:44', '2026-06-14 15:26:15'),
('dfd71648-14fb-4b3d-ac31-f83876076468', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 37150.00, 'pending', 'Credit Card', '2026-04-10 15:46:01', '2026-06-23 15:46:01'),
('e16eca56-a2f5-418c-8d99-d103730e70cd', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 41950.00, 'pending', 'PayPal', '2026-02-21 15:46:01', '2026-06-23 15:46:02'),
('e9d63b30-4296-4e89-89db-145fd9b5e745', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 5150.00, 'cancelled', 'Cash on Delivery', '2026-06-14 11:14:20', '2026-06-14 12:43:09'),
('ea456ddd-86dc-4113-aa26-57c05a712694', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 64950.00, 'delivered', 'Cash on Delivery', '2026-01-21 15:46:01', '2026-06-23 15:46:01'),
('eb9c8fe0-f48b-471e-a509-db911c83a7c4', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 63450.00, 'pending', 'PayPal', '2026-01-20 15:46:01', '2026-06-23 15:46:02'),
('ee3b5da4-1dd4-4b57-bfcc-6b2f0efd09e2', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 11650.00, 'pending', 'Cash on Delivery', '2026-07-04 08:22:46', '2026-07-04 08:22:46'),
('fe9d33ed-7b29-4590-ab21-6b5615350b19', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 79750.00, 'shipped', 'Cash on Delivery', '2025-12-31 15:46:01', '2026-06-23 15:46:01'),
('ffceceb8-3f1a-4b29-a086-a84236fd1eba', '39a3daeb-020d-4522-aeb2-90f70e4d26e0', 10150.00, 'shipped', 'PayPal', '2026-01-03 15:46:01', '2026-06-23 15:46:01');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_items`
--

CREATE TABLE `transaction_items` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `transactionId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `productId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_items`
--

INSERT INTO `transaction_items` (`id`, `transactionId`, `productId`, `quantity`, `price`, `createdAt`, `updatedAt`) VALUES
('01859b62-3d5b-4ada-b67a-c400e121eece', 'c9cb49e6-ebba-4964-a8a8-986c2816d6db', '2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 2, 8500.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('06e04de1-ead1-4e80-b937-24cdac18029e', 'ee3b5da4-1dd4-4b57-bfcc-6b2f0efd09e2', '40da4d0a-4fa2-4716-ade4-e671e1a64b2b', 1, 11500.00, '2026-07-04 08:22:46', '2026-07-04 08:22:46'),
('070d85f9-4869-4244-96f2-437c6790961c', 'bccd03b4-ce7f-4aaf-a5f0-f8ad7b2cb153', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 1, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('07d56be5-f2e1-4cd7-a7e4-5c44ad82eb0e', 'c518653f-348e-4666-b420-4655713f15ad', '2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 1, 8500.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('08a1dc0f-6bba-4a78-adae-d96599b4c4dc', 'ea456ddd-86dc-4113-aa26-57c05a712694', '2a36eb5c-67fb-11f1-9e0b-54e1adc3251b', 2, 15000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('0f69365e-849a-471d-8bce-cedae452e3cc', 'd9122248-be57-4702-bb9b-32c8ed94be97', '2a37164e-67fb-11f1-9e0b-54e1adc3251b', 1, 9200.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('11a1ec73-7386-4bb5-b622-b4b94efa5b53', 'c9cb49e6-ebba-4964-a8a8-986c2816d6db', '2a36eb5c-67fb-11f1-9e0b-54e1adc3251b', 1, 15000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('12587f0e-098a-49d9-aa4c-408634335697', '72f018ec-ee24-44d5-86ef-9ab90ab41cd1', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 1, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('136917cd-d327-4935-aac3-0f6f652031eb', 'be530640-bf72-42f0-b3c9-68f6d37bec21', '2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 1, 8500.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('1b6a9417-f39f-41de-b1b5-68c750c19dae', '942b5175-dbae-4b82-ac18-444d18a03322', '2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 1, 8500.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('1c5bc9c7-3ce1-4262-9480-8a3e8aa0496a', 'ea456ddd-86dc-4113-aa26-57c05a712694', '1c553a51-314b-4534-9d26-a72061ff8994', 2, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('1cff710e-d4c6-4b56-ad95-acaa9eade903', 'fe9d33ed-7b29-4590-ab21-6b5615350b19', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 2, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('234c3265-61e0-4f44-b0e3-0a3f2bab7efd', 'fe9d33ed-7b29-4590-ab21-6b5615350b19', '2a36eb5c-67fb-11f1-9e0b-54e1adc3251b', 2, 15000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('23eca275-e90b-4e40-89ea-32e63204d0b4', '00c2448f-2823-4bf1-8759-d15234decbae', '1c553a51-314b-4534-9d26-a72061ff8994', 4, 5000.00, '2026-06-23 14:33:20', '2026-06-23 14:33:20'),
('288acad2-11d4-4164-b620-73276b7557d2', 'dc0402c4-0b09-4844-987b-8f191b0bbf8c', '2a39687a-747f-46e6-b881-ffd8cce8b11a', 1, 3454.00, '2026-06-14 15:25:44', '2026-06-14 15:25:44'),
('2a71463d-077f-44d3-959e-8e1bb98dd787', '7e496c0e-e824-4bb1-8dbb-bd33e153cc5b', '2a37164e-67fb-11f1-9e0b-54e1adc3251b', 2, 9200.00, '2026-06-23 15:46:02', '2026-06-23 15:46:02'),
('2c26aeee-be16-4c63-9651-3d778183f69b', 'b4b007c0-60e1-4f73-be00-ff37755a8dc9', '1c553a51-314b-4534-9d26-a72061ff8994', 1, 5000.00, '2026-06-14 15:03:29', '2026-06-14 15:03:29'),
('303aed60-46ba-4478-b1b5-1e1f3e1e083b', 'cfbcfc7a-3afd-4570-9c84-058cdb4987c1', '1c553a51-314b-4534-9d26-a72061ff8994', 2, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('31b64be1-c6f2-426f-9d71-4d043473ed05', '7a37f2ea-6695-44a0-915a-c6b0664d3c8c', '2a37164e-67fb-11f1-9e0b-54e1adc3251b', 1, 9200.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('3b890fad-ced4-439d-85f9-629766eecfd3', 'c9cb49e6-ebba-4964-a8a8-986c2816d6db', '2a37164e-67fb-11f1-9e0b-54e1adc3251b', 1, 9200.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('3c6c5c4f-ea15-47e6-87c8-091e1a58eac5', '72f018ec-ee24-44d5-86ef-9ab90ab41cd1', '1c553a51-314b-4534-9d26-a72061ff8994', 1, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('443b3579-d010-4783-8564-4231c0f75a6a', '2851b94e-8a9f-494f-87e4-d2f25466b570', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 1, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('45df0cc7-fa2e-41ef-af66-18aab84d1ced', '3da2f14b-5460-4b3d-bcc5-dc1ee8f47e85', '2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 1, 8500.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('46f2cbce-6214-4aeb-94a9-d77b0bc82607', '3da2f14b-5460-4b3d-bcc5-dc1ee8f47e85', '2a36eb5c-67fb-11f1-9e0b-54e1adc3251b', 1, 15000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('4877ada8-c64a-4571-9a42-ee33e3d90a56', 'ea456ddd-86dc-4113-aa26-57c05a712694', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 2, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('496d3175-8f74-4c2c-a55f-c008ed37bfe8', 'e9d63b30-4296-4e89-89db-145fd9b5e745', '1c553a51-314b-4534-9d26-a72061ff8994', 1, 5000.00, '2026-06-14 11:14:20', '2026-06-14 11:14:20'),
('4c08cb66-d5d8-4e8e-b462-2f56f121c8b7', 'eb9c8fe0-f48b-471e-a509-db911c83a7c4', '2a36eb5c-67fb-11f1-9e0b-54e1adc3251b', 2, 15000.00, '2026-06-23 15:46:02', '2026-06-23 15:46:02'),
('53f41fea-244b-4d31-a6d3-8a6a57810a45', 'c2d51105-3207-4685-bb1f-caf0e19a7abc', '1c553a51-314b-4534-9d26-a72061ff8994', 2, 5000.00, '2026-06-14 11:13:52', '2026-06-14 11:13:52'),
('58353030-bcbe-4716-abba-03b10dbd10d3', 'e16eca56-a2f5-418c-8d99-d103730e70cd', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 2, 12400.00, '2026-06-23 15:46:02', '2026-06-23 15:46:02'),
('59f95a24-a5c3-4ac6-bbbd-6618c9668d0b', '214213cb-1c43-435b-bae5-7bc967d34493', '1c553a51-314b-4534-9d26-a72061ff8994', 2, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('5e7cdffb-8b66-44f2-89b3-5fa9971264dd', '21249c8f-3a38-465b-b321-1ff338dfd32d', '2a37164e-67fb-11f1-9e0b-54e1adc3251b', 2, 9200.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('631e0475-c744-477e-bcdb-2cd9299727d7', '577cbb0f-1b1e-4bb8-bf07-c8af316b8ab4', '1c553a51-314b-4534-9d26-a72061ff8994', 2, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('63aa916f-3fe1-44ac-a6a0-c0357d873c4e', 'b0386729-19ee-4b6e-aec6-a65372e39d2d', '1c553a51-314b-4534-9d26-a72061ff8994', 1, 5000.00, '2026-06-14 11:44:14', '2026-06-14 11:44:14'),
('64fff51e-6f42-4d19-9f63-9dfc4e03e895', '7a37f2ea-6695-44a0-915a-c6b0664d3c8c', '2a37164e-67fb-11f1-9e0b-54e1adc3251b', 2, 9200.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('686c3d42-4df5-42e8-bf29-8e236815996f', 'eb9c8fe0-f48b-471e-a509-db911c83a7c4', '2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 1, 8500.00, '2026-06-23 15:46:02', '2026-06-23 15:46:02'),
('72a9eb00-b5c3-4e4c-9129-10998ea708b5', '415fb0a7-6324-4bdd-b657-ac724d9fcea3', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 2, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('7a502683-f468-46d9-b061-ba8c13ae6fe2', '415fb0a7-6324-4bdd-b657-ac724d9fcea3', '1c553a51-314b-4534-9d26-a72061ff8994', 2, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('7d9cf55c-9b02-4a91-b327-0a6296b27431', '21249c8f-3a38-465b-b321-1ff338dfd32d', '2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 2, 8500.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('80957a22-8f00-4d6d-b038-320f1086d358', 'b0386729-19ee-4b6e-aec6-a65372e39d2d', '2a39687a-747f-46e6-b881-ffd8cce8b11a', 1, 3454.00, '2026-06-14 11:44:14', '2026-06-14 11:44:14'),
('83f7f0b5-3da1-4ada-8b98-0cd82343d6f9', 'ae3e95d2-48e2-4602-b352-b09dcdbefd8a', '323bc4e8-084c-419d-8016-843f10727e8d', 1, 950.00, '2026-07-04 08:29:37', '2026-07-04 08:29:37'),
('88705898-1391-47e6-aac6-b0742d008df8', '577cbb0f-1b1e-4bb8-bf07-c8af316b8ab4', '2a37164e-67fb-11f1-9e0b-54e1adc3251b', 2, 9200.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('8b666c67-aa14-47fc-9e68-486a78517fc0', '21249c8f-3a38-465b-b321-1ff338dfd32d', '1c553a51-314b-4534-9d26-a72061ff8994', 1, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('8c854b43-5e6d-4f31-88c4-3a2494f394db', '80cbda24-fb7e-4862-ab3f-9171e5097735', '2a36eb5c-67fb-11f1-9e0b-54e1adc3251b', 2, 15000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('8daa28a4-1c73-4dad-97a5-d5b81b2853b7', 'dfd71648-14fb-4b3d-ac31-f83876076468', '2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 2, 8500.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('8e0b72ed-ac79-4061-86fa-bdb5bba356f8', '6c229c0c-4a15-4d30-84fe-1972c0e3cc10', '2a36eb5c-67fb-11f1-9e0b-54e1adc3251b', 1, 15000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('90a862b4-54dc-44ae-917d-4d11ca6694c7', 'be530640-bf72-42f0-b3c9-68f6d37bec21', '2a37164e-67fb-11f1-9e0b-54e1adc3251b', 1, 9200.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('a19c3190-7cd9-407b-bd95-7d1436e011e5', 'bf9fa134-fea1-413c-8653-13a198d002a7', '1c553a51-314b-4534-9d26-a72061ff8994', 2, 5000.00, '2026-06-23 15:46:02', '2026-06-23 15:46:02'),
('a51f51ff-c1b9-4869-9d61-207454655cae', 'ffceceb8-3f1a-4b29-a086-a84236fd1eba', '1c553a51-314b-4534-9d26-a72061ff8994', 2, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('a6c3e322-4c4f-477b-ab08-03911c093577', 'ade5c75b-444b-4412-a22d-c1a67dce971c', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 2, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('a7cc5390-a2a4-447a-8717-7ffa9c09b308', 'eb9c8fe0-f48b-471e-a509-db911c83a7c4', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 2, 12400.00, '2026-06-23 15:46:02', '2026-06-23 15:46:02'),
('a9af3ff2-ed25-4e39-8741-096f426ce8ba', '61f97f6e-0288-4bcb-9d5d-cbef33bdd2b3', '1c553a51-314b-4534-9d26-a72061ff8994', 1, 5000.00, '2026-06-14 11:17:56', '2026-06-14 11:17:56'),
('b36b2cc2-54ab-428d-a9e1-b5d481720b18', '72f018ec-ee24-44d5-86ef-9ab90ab41cd1', '2a36eb5c-67fb-11f1-9e0b-54e1adc3251b', 1, 15000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('b40d165f-fdd3-4d55-82c6-cf5c87bf43a3', 'a6df9cdd-a04a-4118-a527-401dc2cf8cf2', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 2, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('b525130c-0ff6-49a4-b157-4eca4f119b95', 'ade5c75b-444b-4412-a22d-c1a67dce971c', '1c553a51-314b-4534-9d26-a72061ff8994', 2, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('b5fa46cb-d107-40ea-87b5-59267a56e014', '4bb4575f-defb-482b-859a-e9a439673db9', '2a39687a-747f-46e6-b881-ffd8cce8b11a', 2, 3454.00, '2026-06-14 12:56:28', '2026-06-14 12:56:28'),
('b93ef7a0-af31-4dea-b7fb-a11464aa0755', 'dfd71648-14fb-4b3d-ac31-f83876076468', '1c553a51-314b-4534-9d26-a72061ff8994', 1, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('b95f3923-8043-44b6-b86c-dfaf24adba2b', '80cbda24-fb7e-4862-ab3f-9171e5097735', '1c553a51-314b-4534-9d26-a72061ff8994', 1, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('ba14e733-a514-4ea1-88c5-2ecd69c6b654', '2851b94e-8a9f-494f-87e4-d2f25466b570', '2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 1, 8500.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('bdf12758-7309-49f6-ae6a-3d249d5890e1', '415fb0a7-6324-4bdd-b657-ac724d9fcea3', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 2, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('bf8142da-1482-4dc7-99b7-842fcd2781e4', 'd9122248-be57-4702-bb9b-32c8ed94be97', '2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 2, 8500.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('c58ef89f-4a15-4a5d-9757-fc3a931b7125', '63574e54-194d-44ff-a52c-7af6c554a057', '1c553a51-314b-4534-9d26-a72061ff8994', 1, 5000.00, '2026-06-14 11:27:23', '2026-06-14 11:27:23'),
('c93489f4-aeca-44dd-91de-d8320cb4a823', 'dfd71648-14fb-4b3d-ac31-f83876076468', '2a36eb5c-67fb-11f1-9e0b-54e1adc3251b', 1, 15000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('ca180b11-4ef3-4a1c-af83-80ccf664e0aa', '4bb4575f-defb-482b-859a-e9a439673db9', '1c553a51-314b-4534-9d26-a72061ff8994', 3, 5000.00, '2026-06-14 12:56:28', '2026-06-14 12:56:28'),
('d4f2f1c6-8240-4dbe-a0e8-3cadc4ed8102', '32fcb895-fc00-4c6f-9f4a-6b9e9cace5c3', '163f1b31-9adc-41c3-b50a-f377d6897a7d', 1, 9500.00, '2026-07-04 08:24:18', '2026-07-04 08:24:18'),
('d659036e-f3fa-4403-a4a4-d5edfea3d65b', '8b9d3e9a-dbba-48c4-bda6-fbd0f3c5281b', '1c553a51-314b-4534-9d26-a72061ff8994', 2, 5000.00, '2026-06-23 15:46:02', '2026-06-23 15:46:02'),
('dcdd36a7-fbe6-4d89-bb06-976576fa986c', 'a5806a9c-155a-4cc0-9e7a-e96dd2f08c06', '40da4d0a-4fa2-4716-ade4-e671e1a64b2b', 1, 11500.00, '2026-06-24 02:09:15', '2026-06-24 02:09:15'),
('e03c2238-dd50-49ad-b8cf-01f4c9d66dee', '5f07b35a-4858-4b82-b9af-ba9ee3bf56bf', '2a36eb5c-67fb-11f1-9e0b-54e1adc3251b', 1, 15000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('e2f2f885-cfa3-4641-b22f-3b64c927a68a', 'b2475bae-b271-4dc3-a17d-40e5e0d67a5f', '2a37164e-67fb-11f1-9e0b-54e1adc3251b', 1, 9200.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('e49308e3-3561-457f-a7d8-df1a0537458d', 'fe9d33ed-7b29-4590-ab21-6b5615350b19', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 2, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('e61305bb-75b4-4c90-9efe-0c6bc10d35a8', 'bf9fa134-fea1-413c-8653-13a198d002a7', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 2, 12400.00, '2026-06-23 15:46:02', '2026-06-23 15:46:02'),
('f1d232b1-829a-464f-9d90-c93733aa9d9a', 'c518653f-348e-4666-b420-4655713f15ad', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 1, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('f3a9b79a-8448-47f4-9f89-194c784db997', 'e16eca56-a2f5-418c-8d99-d103730e70cd', '2a3710ab-67fb-11f1-9e0b-54e1adc3251b', 2, 8500.00, '2026-06-23 15:46:02', '2026-06-23 15:46:02'),
('f3b77495-5bbe-40f1-ac02-876a99b4a7cc', '214213cb-1c43-435b-bae5-7bc967d34493', '2a37141d-67fb-11f1-9e0b-54e1adc3251b', 1, 12400.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('f774a5b8-1d76-41d5-8462-dbc8f7e0f02e', 'cfbcfc7a-3afd-4570-9c84-058cdb4987c1', '1c553a51-314b-4534-9d26-a72061ff8994', 1, 5000.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('fcce37b1-a481-4e2c-b661-5b05bcf9db23', 'bf9fa134-fea1-413c-8653-13a198d002a7', '1c553a51-314b-4534-9d26-a72061ff8994', 2, 5000.00, '2026-06-23 15:46:02', '2026-06-23 15:46:02'),
('fecf13f1-adfd-457b-9455-de31674b86e0', 'a6df9cdd-a04a-4118-a527-401dc2cf8cf2', '2a37164e-67fb-11f1-9e0b-54e1adc3251b', 1, 9200.00, '2026-06-23 15:46:01', '2026-06-23 15:46:01'),
('fff34105-428b-4531-bc2a-62ef0ace5e7d', '7f4aa656-db29-4b3d-bd0a-1eb26649968f', '2a39687a-747f-46e6-b881-ffd8cce8b11a', 1, 3454.00, '2026-06-14 12:59:55', '2026-06-14 12:59:55');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin','head_admin','staff') DEFAULT 'customer',
  `status` enum('active','deactivated','pending_verification') DEFAULT 'pending_verification',
  `token` text DEFAULT NULL,
  `verificationToken` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `profilePicture`, `email`, `password`, `role`, `status`, `token`, `verificationToken`, `createdAt`, `updatedAt`) VALUES
('39a3daeb-020d-4522-aeb2-90f70e4d26e0', 'Head', 'Admin', NULL, 'headadmin@test.com', '$2b$10$NTT6br25lnYvkhWaJMSla.U/vGScveP/NyLmI6j9rrPZ6PRyvXIEe', 'head_admin', 'active', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5YTNkYWViLTAyMGQtNDUyMi1hZWIyLTkwZjcwZTRkMjZlMCIsImlhdCI6MTc4MzQyMTQ2MSwiZXhwIjoxNzg2MDEzNDYxfQ.etXS-_PQhn8bHSkmSQc8sbsL78ZZ4oyaBUAEx9cuhDM', NULL, '2026-06-13 19:15:40', '2026-07-07 10:51:01'),
('6d2c1b0d-06bd-44d9-91c6-82f15bd91b3a', 'Dean Joefrey', 'Cabarles', '/images/uploads/1782262719668-717280069.png', 'deanjoefrey@gmail.com', '$2b$10$pmjeH/cz.xJl.pESI9JcZOkdswxvtfvZC.gSlpk8VKX8JCoNwe3da', 'customer', 'active', NULL, NULL, '2026-06-14 10:49:00', '2026-07-07 10:47:21'),
('89cd01ec-5490-4afc-85be-6e6bbc1fbc32', 'Francine', 'Terrobias', '/images/default-avatar.png', 'francineterrobias@gmail.com', '$2b$10$0FWOyn6qmTGGPiGCNOwyG.UcmymkwqgWn.Gta15Q/T7StS24nSRPK', 'staff', 'active', NULL, NULL, '2026-06-24 01:48:59', '2026-07-04 07:31:44'),
('94026a93-3c21-4a41-a5ab-612d106bbc05', 'Reyns Ias', 'Nyol', '/images/default-avatar.png', 'deanjoefrey4@gmail.com', '$2b$10$e/F76xF523VSKCH7vlQmXuwp/cXeTl85vRlhR97SoR1qzP31uYYrG', 'customer', 'active', NULL, NULL, '2026-06-24 02:16:55', '2026-06-24 02:17:23'),
('b75681e9-120c-4ebf-aada-fe8a40730364', 'Dean ', 'Joefrey', '/images/default-avatar.png', 'deanjoefrey2@gmail.com', '$2b$10$4IOh9yYsnI1gCI1G6tBohO1Ai05R./Bdl6AGQ1aMswL.C9TAlNQU6', 'customer', 'active', NULL, NULL, '2026-06-24 02:08:14', '2026-07-03 16:07:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `name_21` (`name`),
  ADD UNIQUE KEY `name_22` (`name`),
  ADD UNIQUE KEY `name_23` (`name`),
  ADD UNIQUE KEY `name_24` (`name`),
  ADD UNIQUE KEY `name_25` (`name`),
  ADD UNIQUE KEY `name_26` (`name`),
  ADD UNIQUE KEY `name_27` (`name`),
  ADD UNIQUE KEY `name_28` (`name`),
  ADD UNIQUE KEY `name_29` (`name`),
  ADD UNIQUE KEY `name_30` (`name`),
  ADD UNIQUE KEY `name_31` (`name`),
  ADD UNIQUE KEY `name_32` (`name`),
  ADD UNIQUE KEY `name_33` (`name`),
  ADD UNIQUE KEY `name_34` (`name`),
  ADD UNIQUE KEY `name_35` (`name`),
  ADD UNIQUE KEY `name_36` (`name`),
  ADD UNIQUE KEY `name_37` (`name`),
  ADD UNIQUE KEY `name_38` (`name`),
  ADD UNIQUE KEY `name_39` (`name`),
  ADD UNIQUE KEY `name_40` (`name`),
  ADD UNIQUE KEY `name_41` (`name`),
  ADD UNIQUE KEY `name_42` (`name`),
  ADD UNIQUE KEY `name_43` (`name`),
  ADD UNIQUE KEY `name_44` (`name`),
  ADD UNIQUE KEY `name_45` (`name`),
  ADD UNIQUE KEY `name_46` (`name`),
  ADD UNIQUE KEY `name_47` (`name`),
  ADD UNIQUE KEY `name_48` (`name`),
  ADD UNIQUE KEY `name_49` (`name`),
  ADD UNIQUE KEY `name_50` (`name`),
  ADD UNIQUE KEY `name_51` (`name`),
  ADD UNIQUE KEY `name_52` (`name`),
  ADD UNIQUE KEY `name_53` (`name`),
  ADD UNIQUE KEY `name_54` (`name`),
  ADD UNIQUE KEY `name_55` (`name`),
  ADD UNIQUE KEY `name_56` (`name`),
  ADD UNIQUE KEY `name_57` (`name`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `brandId` (`brandId`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reviews_user_id_product_id` (`userId`,`productId`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transactionId` (`transactionId`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_51` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_53` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD UNIQUE KEY `email_56` (`email`),
  ADD UNIQUE KEY `email_57` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_80` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_81` FOREIGN KEY (`brandId`) REFERENCES `brands` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_67` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_68` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD CONSTRAINT `transaction_items_ibfk_111` FOREIGN KEY (`transactionId`) REFERENCES `transactions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transaction_items_ibfk_112` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
