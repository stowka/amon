--
-- Net Production Manager
-- @author Antoine De Gieter
-- @copyright Net Production Köbe & Co
--

DROP DATABASE IF EXISTS `NPM`;
CREATE DATABASE `NPM` CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `NPM`;

--
-- Procedures
--
DELIMITER $$

CREATE PROCEDURE set_user_access(IN user_id INT)

BEGIN
	SELECT "set_user_access" AS log;
	-- TODO add accesses to specified bundles for all users in groups
END $$

CREATE PROCEDURE set_project_access(IN project_id INT)

BEGIN
	SELECT "set_project_access" AS log;
	-- TODO add full access to this project for all users in groups
END $$

CREATE PROCEDURE set_subproject_access(IN subproject_id INT)

BEGIN
	SELECT "set_subproject_access" AS log;
	-- TODO add full access to this subproject for all users in groups
END $$

CREATE PROCEDURE set_collaborator(IN user_id INT, IN subproject_id INT)

BEGIN
	SELECT "set_collaborator" AS log;
	-- TODO add full access to this subproject for this user
END $$

DELIMITER ;

-- TABLES

-- BEGIN
-- hashtags
--
CREATE TABLE tag (
	`id` INT AUTO_INCREMENT,
	`tag` VARCHAR(15) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY (`tag`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";
--
-- hashtags
-- END

-- BEGIN
-- address book
--
CREATE TABLE contact (
	`id` INT AUTO_INCREMENT,
	`first_name` VARCHAR(31) NOT NULL,
	`last_name` VARCHAR(31) NOT NULL,
	`email` VARCHAR(31) NOT NULL,
	`address` VARCHAR(255) DEFAULT "",
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";

CREATE TABLE phone (
	`id` INT AUTO_INCREMENT,
	`country_code` VARCHAR(3) NOT NULL,
	`number` VARCHAR(15) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";

CREATE TABLE has_phone (
	`contact` INT NOT NULL,
	`phone` INT NOT NULL,
	PRIMARY KEY (`contact`, `phone`),
	CONSTRAINT `fk_has_phone_contact`
		FOREIGN KEY (`contact`)
		REFERENCES contact(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_has_phone_phone`
		FOREIGN KEY (`phone`)
		REFERENCES phone(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET="utf8";
-- 
-- address book
-- END

-- BEGIN
-- internal access
--
CREATE TABLE team (
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(15) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";

LOCK TABLES team WRITE;
INSERT INTO team (name)
VALUES ("Administrators"), ("Developers"), ("Designers"),
("Salers"), ("Interns"), ("Customers");
UNLOCK TABLES;

CREATE TABLE user (
	`id` INT AUTO_INCREMENT,
	`username` VARCHAR(8) NOT NULL,
	`password_hash` VARCHAR(40) NOT NULL COMMENT "SHA-1",
	`token_hash` VARCHAR(40) NOT NULL COMMENT "SHA-1",
	`contact` INT NOT NULL,
	`start_date` DATE NOT NULL,
	`end_date` DATE NOT NULL COMMENT "9999-12-31 = unlimited",
	PRIMARY KEY (`id`),
	CONSTRAINT `fk_user_contact`
		FOREIGN KEY (`contact`)
		REFERENCES contact(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";

CREATE TABLE membership (
	`user` INT NOT NULL,
	`team` INT NOT NULL,
	PRIMARY KEY (`user`, `team`),
	CONSTRAINT `fk_membership_user`
		FOREIGN KEY (`user`)
		REFERENCES user(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_membership_team`
		FOREIGN KEY (`team`)
		REFERENCES team(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET="utf8";

CREATE TABLE access_key (
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(15) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";

LOCK TABLES access_key WRITE;
INSERT INTO access_key (name)
VALUES ("users_and_roles"), ("tasks"), ("self_tasks"), ("contacts"),
("history_of_communication"), ("agenda"), ("estimation_and_billing"),
("projects"), ("timeline"), ("overview"), ("file_uploader"), ("messages");
UNLOCK TABLES;

CREATE TABLE user_access (
	`id` INT AUTO_INCREMENT,
	`user` INT NOT NULL,
	`access_key` INT NOT NULL,
	`mode` ENUM("f", "r", "w", "rw") DEFAULT "r" COMMENT "f=forbidden, r=read, w=write",
	PRIMARY KEY (`id`),
	CONSTRAINT `fk_user_access_user`
		FOREIGN KEY (`user`)
		REFERENCES user(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_user_access_access_key`
		FOREIGN KEY (`access_key`)
		REFERENCES access_key(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";

-- Triggers
DELIMITER $$
CREATE TRIGGER set_access AFTER INSERT
ON user FOR EACH ROW

BEGIN
	SET @user_id := NEW.id;
	CALL set_user_access(@user_id);
END $$

DELIMITER ;

--
-- internal access
-- END

-- BEGIN
-- file storage
--
CREATE TABLE file_kind (
	`id` INT AUTO_INCREMENT,
	`mime` VARCHAR(15) NOT NULL,
	`label` VARCHAR(31) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY (`mime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";

LOCK TABLES file_kind WRITE;
INSERT INTO file_kind (mime, label)
VALUES ("application/pdf", "PDF"), ("image/jpeg", "JPG"), 
("image/png", "PNG"), ("text/plain", "TXT");
UNLOCK TABLES;

CREATE TABLE file (
	`id` INT AUTO_INCREMENT,
	`kind` INT NOT NULL,
	`size` BIGINT(20) NOT NULL,
	`upload_dt` DATETIME DEFAULT NOW(),
	`author` INT NOT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT `fk_file_kind`
		FOREIGN KEY (`kind`)
		REFERENCES file_kind(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_file_author`
		FOREIGN KEY (`author`)
		REFERENCES user(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";

CREATE TABLE file_tag (
	`file` INT NOT NULL,
	`tag` INT NOT NULL,
	PRIMARY KEY (`file`, `tag`),
	CONSTRAINT `fk_file_tag_file`
		FOREIGN KEY (`file`)
		REFERENCES file(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_file_tag_tag`
		FOREIGN KEY (`tag`)
		REFERENCES tag(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET="utf8";
--
-- file storage
-- END

-- BEGIN
-- projects
--
CREATE TABLE project (
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(31) NOT NULL,
	`short_description` VARCHAR(63) DEFAULT "",
	`long_description` VARCHAR(2047) DEFAULT "",
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";

CREATE TABLE subproject (
	`id` INT AUTO_INCREMENT,
	`project` INT NOT NULL,
	`name` VARCHAR(31) NOT NULL,
	`github_repo` VARCHAR(63) DEFAULT "",
	`tag` INT NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY (`tag`),
	CONSTRAINT `fk_subproject_project`
		FOREIGN KEY (`project`)
		REFERENCES project(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_subproject_tag`
		FOREIGN KEY (`tag`)
		REFERENCES tag(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";

CREATE TABLE collaborator (
	`user` INT NOT NULL,
	`subproject` INT NOT NULL,
	PRIMARY KEY (`user`, `subproject`),
	CONSTRAINT `fk_collaborator_user`
		FOREIGN KEY (`user`)
		REFERENCES user(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_collaborator_subproject`
		FOREIGN KEY (`subproject`)
		REFERENCES subproject(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET="utf8";

CREATE TABLE project_access (
	`project` INT NOT NULL,
	`user` INT NOT NULL,
	`access` ENUM("f", "r", "w", "rw"),
	CONSTRAINT `fk_project_access_project`
		FOREIGN KEY (`project`)
		REFERENCES project(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_project_access_user`
		FOREIGN KEY (`user`)
		REFERENCES user(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET="utf8";

CREATE TABLE subproject_access (
	`subproject` INT NOT NULL,
	`user` INT NOT NULL,
	`access` ENUM("f", "r", "w", "rw"),
	CONSTRAINT `fk_subproject_access_subproject`
		FOREIGN KEY (`subproject`)
		REFERENCES subproject(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_subproject_access_user`
		FOREIGN KEY (`user`)
		REFERENCES user(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET="utf8";
--
-- projects
-- END

-- BEGIN
-- task manager
--
CREATE TABLE task (
	`id` INT AUTO_INCREMENT,
	`text` VARCHAR(255) NOT NULL,
	`done` BOOLEAN DEFAULT 0,
	`priority` ENUM("low", "normal", "high"),
	`creation_dt` DATETIME DEFAULT NOW(),
	`critical_date` DATE COMMENT "when the priority increases to high",
	`end_date` DATE NOT NULL COMMENT "when the task has to be done",
	`from` INT NOT NULL COMMENT "user",
	`to` INT NOT NULL COMMENT "user",
	PRIMARY KEY (`id`),
	CONSTRAINT `fk_task_from`
		FOREIGN KEY (`from`)
		REFERENCES user(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_task_to`
		FOREIGN KEY (`to`)
		REFERENCES user(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";
--
-- task manager
-- END

-- BEGIN
-- messaging
--
CREATE TABLE message (
	`id` BIGINT(20) AUTO_INCREMENT,
	`from` INT NOT NULL COMMENT "user",
	`text` VARCHAR(8093) DEFAULT "(Y)",
	`dt` DATETIME DEFAULT NOW(),
	PRIMARY KEY (`id`),
	CONSTRAINT `fk_message_from`
		FOREIGN KEY (`from`)
		REFERENCES user(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET="utf8";

CREATE TABLE recipient (
	`message` BIGINT(20) NOT NULL,
	`to` INT NOT NULL,
	PRIMARY KEY(`message`, `to`),
	CONSTRAINT `fk_recipient_message`
		FOREIGN KEY (`message`)
		REFERENCES message(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_recipient_to`
		FOREIGN KEY (`to`)
		REFERENCES user(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET="utf8";

CREATE TABLE message_tag (
	`message` BIGINT(20) NOT NULL,
	`tag` INT NOT NULL,
	PRIMARY KEY (`message`, `tag`),
	CONSTRAINT `fk_message_tag_message`
		FOREIGN KEY (`message`)
		REFERENCES message(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_message_tag_tag`
		FOREIGN KEY (`tag`)
		REFERENCES tag(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET="utf8";

CREATE TABLE attachment (
	`message` BIGINT(20) NOT NULL,
	`file` INT NOT NULL,
	PRIMARY KEY (`message`, `file`),
	CONSTRAINT `fk_attachment_message`
		FOREIGN KEY (`message`)
		REFERENCES message(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT `fk_attachment_file`
		FOREIGN KEY (`file`)
		REFERENCES file(`id`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET="utf8";
--
-- messaging
-- END

--
-- 
--