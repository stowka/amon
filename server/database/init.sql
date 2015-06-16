--
-- Net Production Manager
-- @author Antoine De Gieter
-- @copyright Net Production Köbe & Co
--

DROP DATABASE IF EXISTS `Amon`;
CREATE DATABASE `Amon` CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `Amon`;

SET autocommit = 0;

START TRANSACTION;

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

CREATE PROCEDURE set_collaborator(IN user_id INT, IN project_id INT)

BEGIN
    SELECT "set_collaborator" AS log;
    -- TODO add full access to this project for this user
END $$

DELIMITER ;

-- TABLES

-- BEGIN
-- hashtags
--
CREATE TABLE tag (
    `id`  INT AUTO_INCREMENT,
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
CREATE TABLE language (
    `code`  VARCHAR(5),
    `label` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET="utf8";

CREATE TABLE title (
    `id` INT AUTO_INCREMENT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE title_translation (
    `id`       INT AUTO_INCREMENT,
    `label`    VARCHAR(25) NOT NULL,
    `language` VARCHAR(5) NOT NULL,
    `title`    INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_title_translation_title`
        FOREIGN KEY (`title`)
        REFERENCES title(`id`),
    CONSTRAINT `fk_title_translation_language`
        FOREIGN KEY (`language`)
        REFERENCES language(`code`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE contact (
    `id`         INT AUTO_INCREMENT,
    `title`      INT NOT NULL,
    `first_name` VARCHAR(31) NOT NULL,
    `last_name`  VARCHAR(31) NOT NULL,
    `email`      VARCHAR(31) NOT NULL,
    `address`    VARCHAR(255) DEFAULT "",
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_contact_title`
        FOREIGN KEY (`title`)
        REFERENCES title(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE phone (
    `id`           INT AUTO_INCREMENT,
    `country_code` VARCHAR(3) NOT NULL,
    `number`       VARCHAR(15) NOT NULL,
    `contact`      INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_phone_contact`
        FOREIGN KEY (`contact`)
        REFERENCES contact(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE company (
    `id`      INT NOT NULL AUTO_INCREMENT,
    `name`    VARCHAR(100) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `email`   VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE works_for (
    `contact` INT NOT NULL,
    `company` INT NOT NULL,
    PRIMARY KEY (`contact`, `company`),
    CONSTRAINT `fk_works_for_contact`
        FOREIGN KEY (`contact`)
        REFERENCES contact(`id`),
    CONSTRAINT `fk_works_for_company`
        FOREIGN KEY (`company`)
        REFERENCES company(`id`)
) ENGINE=InnoDB DEFAULT CHARSET="utf8";

CREATE TABLE company_phone (
    `company` INT NOT NULL,
    `phone`   INT NOT NULL,
    PRIMARY KEY (`company`, `phone`),
    CONSTRAINT `fk_company_phone_company`
        FOREIGN KEY (`company`)
        REFERENCES contact(`id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT `fk_company_phone_phone`
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
    `id`   INT AUTO_INCREMENT,
    `name` VARCHAR(15) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

LOCK TABLES team WRITE;
INSERT INTO team (name)
VALUES ("Administrators"), ("Developers"), ("Designers"),
("Salers"), ("Interns"), ("Customers");
UNLOCK TABLES;

CREATE TABLE user (
    `id`            INT AUTO_INCREMENT,
    `username`      VARCHAR(8) NOT NULL,
    `password_hash` VARCHAR(40) NOT NULL COMMENT "SHA-1",
    `contact`       INT NOT NULL,
    `start_date`    DATE NOT NULL,
    `end_date`      DATE NOT NULL COMMENT "9999-12-31 = unlimited",
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_user_contact`
        FOREIGN KEY (`contact`)
        REFERENCES contact(`id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE session (
    `id`            INT AUTO_INCREMENT,
    `user`          INT NOT NULL,
    `ip`            VARCHAR(15) NOT NULL,
    `token_hash`    VARCHAR(40) NOT NULL COMMENT "0x",
    `login_dt`      DATETIME DEFAULT NOW(),
    `user_agent`    VARCHAR(1023),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_session_user`
        FOREIGN KEY (`user`)
        REFERENCES user(`id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

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

CREATE TABLE bundle (
    `id`        INT AUTO_INCREMENT,
    `key`       VARCHAR(15) NOT NULL,
    `name`      VARCHAR(31) NOT NULL,
    `activated` BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE user_access (
    `user`       INT NOT NULL,
    `bundle`     INT NOT NULL,
    `mode`       VARCHAR(4) DEFAULT "f" COMMENT "f=forbidden,
    c=create, r=read, u=update, d=delete",
    PRIMARY KEY (`user`, `bundle`),
    CONSTRAINT `fk_user_access_user`
        FOREIGN KEY (`user`)
        REFERENCES user(`id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT `fk_user_access_bundle`
        FOREIGN KEY (`bundle`)
        REFERENCES bundle(`id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

-- Triggers
/*DELIMITER $$
CREATE TRIGGER set_access AFTER INSERT
ON user FOR EACH ROW

BEGIN
    SET @user_id := NEW.id;
    CALL set_user_access(@user_id);
END $$

DELIMITER ;*/

--
-- internal access
-- END


-- BEGIN
-- projects
--

CREATE TABLE project (
    `id`          INT AUTO_INCREMENT,
    `name`        VARCHAR(31) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `company`     INT NOT NULL,
    `github_repo` VARCHAR(63) DEFAULT "",
    `tag`         INT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`tag`),
    CONSTRAINT `fk_project_company`
        FOREIGN KEY (`company`)
        REFERENCES company(`id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT `fk_project_tag`
        FOREIGN KEY (`tag`)
        REFERENCES tag(`id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE collaborator (
    `user`       INT NOT NULL,
    `project` INT NOT NULL,
    PRIMARY KEY (`user`, `project`),
    CONSTRAINT `fk_collaborator_user`
        FOREIGN KEY (`user`)
        REFERENCES user(`id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT `fk_collaborator_project`
        FOREIGN KEY (`project`)
        REFERENCES project(`id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET="utf8";

CREATE TABLE project_access (
    `project` INT NOT NULL,
    `user`    INT NOT NULL,
    `access`  ENUM("f", "r", "w", "rw"),
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

--
-- projects
-- END

-- BEGIN
-- task manager
--
CREATE TABLE task (
    `id`            INT AUTO_INCREMENT,
    `text`          VARCHAR(255) NOT NULL,
    `done`          BOOLEAN DEFAULT 0,
    `priority`      ENUM("low", "normal", "high"),
    `creation_dt`   DATETIME DEFAULT NOW(),
    `critical_date` DATE COMMENT "when the priority increases to high",
    `end_date`      DATE NOT NULL COMMENT "when the task has to be done",
    `from`          INT NOT NULL COMMENT "user",
    `to`            INT NOT NULL COMMENT "user",
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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";
--
-- task manager
-- END


-- BEGIN
-- quotation
--

CREATE TABLE misc (
    `keyword`  VARCHAR(25),
    `language` VARCHAR(5),
    `text`     VARCHAR(100),
    PRIMARY KEY (`keyword`, `language`),
    CONSTRAINT `fk_misc_language`
        FOREIGN KEY (`language`)
        REFERENCES language(`code`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE payment_method (
    `id` INT AUTO_INCREMENT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE payment_method_translation (
    `id`             INT AUTO_INCREMENT,
    `label`          VARCHAR(25) NOT NULL,
    `language`       VARCHAR(5) NOT NULL,
    `payment_method` INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_payment_method_translation_payment_method`
        FOREIGN KEY (`payment_method`)
        REFERENCES payment_method(`id`),
    CONSTRAINT `fl_payment_method_translation_language`
        FOREIGN KEY (`language`)
        REFERENCES language(`code`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE currency (
    `id`     INT NOT NULL AUTO_INCREMENT,
    `symbol` VARCHAR(5),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE currency_translation (
    `id` INT NOT NULL AUTO_INCREMENT,
    `currency` INT NOT NULL,
    `language` VARCHAR(5) NOT NULL,
    `name`     VARCHAR(25) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_currency_translation_currency`
        FOREIGN KEY (`currency`)
        REFERENCES currency(`id`),
    CONSTRAINT `fk_currency_translation_language`
        FOREIGN KEY (`language`)
        REFERENCES language(`code`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE quotation (
    `id`               INT NOT NULL AUTO_INCREMENT,
    `summary`          VARCHAR(150) NOT NULL,
    `vendor`           INT NOT NULL,
    `customer`         INT NOT NULL,
    `payment_method`   INT NOT NULL,
    `currency`         INT NOT NULL,
    `date_of_creation` DATE NOT NULL,
    `date_of_validity` DATE NOT NULL,
    `last_updated`     DATETIME NOT NULL,
    `last_generated`   DATETIME DEFAULT NULL,
    `language`         VARCHAR(5) NOT NULL,
    `project`          INT DEFAULT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_quotation_vendor_contact`
        FOREIGN KEY (`vendor`)
        REFERENCES contact(`id`),
    CONSTRAINT `fk_quotation_customer_contact`
        FOREIGN KEY (`customer`)
        REFERENCES contact(`id`),
    CONSTRAINT `fk_quotation_payment_method`
        FOREIGN KEY (`payment_method`)
        REFERENCES payment_method(`id`),
    CONSTRAINT `fk_quotation_currency`
        FOREIGN KEY (`currency`)
        REFERENCES currency(`id`),
    CONSTRAINT `fk_quotation_language`
        FOREIGN KEY (`language`)
        REFERENCES language(`code`),
    CONSTRAINT `fk_quotation_project`
        FOREIGN KEY (`project`)
        REFERENCES project(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";

CREATE TABLE detail (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `description` TEXT NOT NULL,
    `discount`    FLOAT NOT NULL,
    `quantity`    INT NOT NULL,
    `price`       FLOAT NOT NULL,
    `line`        INT NOT NULL,
    `quotation`   INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_detail_quotation`
        FOREIGN KEY (`quotation`)
        REFERENCES quotation(`id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET="utf8";


--
-- quotation
-- END

--
-- 
--

COMMIT;
