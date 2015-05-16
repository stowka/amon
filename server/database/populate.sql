------------------------------------------------
--- Populate the database with example value ---
------------------------------------------------
USE Amon;

START TRANSACTION;

----------------- language ---------------------------------------
INSERT INTO language VALUES ("fr-CH", "Français");
INSERT INTO language VALUES ("en-GB", "English");

----------------- title ------------------------------------------
INSERT INTO title VALUES (NULL);
INSERT INTO title VALUES (NULL);

----------------- title_translation -------------------------------
INSERT INTO title_translation VALUES (NULL, "M.", "fr-CH", 1);
INSERT INTO title_translation VALUES (NULL, "Mr.", "en-GB", 1);
INSERT INTO title_translation VALUES (NULL, "Mme.", "fr-CH", 2);
INSERT INTO title_translation VALUES (NULL, "Mrs.", "en-GB", 2);

----------------- contact -----------------------------------------
INSERT INTO contact VALUES (NULL, 1, "Oday", "Yehia",
    "oday.yehia@net-production.ch", "Avenue de la Chablière 24, 1003 Lausanne, SUISSE");
INSERT INTO contact VALUES (NULL, 1, "Nathan", "Köbe",
    "nathan.kobe@net-production.ch", "address");
INSERT INTO contact VALUES (NULL, 2, "Mélanie", "Begg", "email@email",
    "adresse");
INSERT INTO contact VALUES (NULL, 1, "François-Xavier", "Béligat",
    "beligat.fx@gmail.com", "12 rue de la Basilique, 25000 Besançon, FRANCE");
INSERT INTO contact VALUES (NULL, 1, "Antoine", "De Gieter",
    "antoine.degieter@net-production.ch", "Montrinsans route de Malpas, 25160 Labergement Sainte-Marie, FRANCE");

------------------ phone ------------------------------------------
INSERT INTO phone VALUES (NULL, 41, "79 193 33 09");
INSERT INTO phone VALUES (NULL, 41, "77 124 21 84");

------------------ contact_phone ----------------------------------
INSERT INTO contact_phone VALUES (1,1);
INSERT INTO contact_phone VALUES (3,2);

----------------- payment_method ----------------------------------
INSERT INTO payment_method VALUES (NULL);

----------------- payment_method_translation -----------------------
INSERT INTO payment_method_translation VALUES (NULL, "Carte Bancaire", "fr-CH", 1);
INSERT INTO payment_method_translation VALUES (NULL, "Credit Card", "en-GB", 1);

----------------- currency ---------------------------------------
INSERT INTO currency VALUES (NULL, "€");
INSERT INTO currency VALUES (NULL, "CHF");

---------------- currency_translation ----------------------------
INSERT INTO currency_translation VALUES (NULL, 1, "fr-CH", "Euros");
INSERT INTO currency_translation VALUES (NULL, 1, "en-GB", "Euros");
INSERT INTO currency_translation VALUES (NULL, 2, "fr-CH", "Francs Suisses");
INSERT INTO currency_translation VALUES (NULL, 2, "en-GB", "Swiss Francs");

----------------- misc -------------------------------------------
INSERT INTO misc VALUES ("quotation", "fr-CH", "Devis");
INSERT INTO misc VALUES ("quotation", "en-GB", "Quotation");
INSERT INTO misc VALUES ("validity", "fr-CH", "Date limite de validité");
INSERT INTO misc VALUES ("validity", "en-GB", "Valid until");
INSERT INTO misc VALUES ("currency", "fr-CH", "Devise");
INSERT INTO misc VALUES ("currency", "en-GB", "Currency");

INSERT INTO misc VALUES ("description", "fr-CH", "Désignation");
INSERT INTO misc VALUES ("description", "en-GB", "Description");
INSERT INTO misc VALUES ("discount", "fr-CH", "Réduction");
INSERT INTO misc VALUES ("discount", "en-GB", "Discount");
INSERT INTO misc VALUES ("quantity", "fr-CH", "Quantité");
INSERT INTO misc VALUES ("quantity", "en-GB", "Quantity");
INSERT INTO misc VALUES ("price", "fr-CH", "Prix");
INSERT INTO misc VALUES ("price", "en-GB", "Price");
INSERT INTO misc VALUES ("total", "fr-CH", "Total HT");
INSERT INTO misc VALUES ("total", "en-GB", "Total excl tax");

INSERT INTO misc VALUES ("payment_method", "fr-CH", "Mode de règlement");
INSERT INTO misc VALUES ("payment_method", "en-GB", "Payment method");
INSERT INTO misc VALUES ("to_pay", "fr-CH", "À payer");
INSERT INTO misc VALUES ("to_pay", "en-GB", "To pay");
INSERT INTO misc VALUES ("vendor", "fr-CH", "Vendeur");
INSERT INTO misc VALUES ("vendor", "en-GB", "Vendor");
INSERT INTO misc VALUES ("customer", "fr-CH", "Client");
INSERT INTO misc VALUES ("customer", "en-GB", "Customer");
INSERT INTO misc VALUES ("signature", "fr-CH", 
    "Date et signature précédées de la mention 'Bon pour accord'");
INSERT INTO misc VALUES ("signature", "en-GB", 
    "Date and signature preceded by the words 'Signed as agreed'");

----------------- quotation --------------------------------------
INSERT INTO quotation VALUES (NULL, "Refonte complète du site internet www.arrowstudio.ch", 
    1, 3, 1, 2, "2015-05-01", "2015-06-01", "fr-CH");

----------------- detail -------------------------------------------
INSERT INTO detail VALUES (NULL, "Application : Paiement", 10, 1, 250, 3, 1);
INSERT INTO detail VALUES (NULL, "Application : Accueil", 10, 1, 2000, 1, 1);
INSERT INTO detail VALUES (NULL, "Application : À Propos", 10, 1, 400, 2, 1);

----------------- bundle ----------------------------------------------
INSERT INTO bundle VALUES (NULL, "users_and_roles", "Users and roles", TRUE);
INSERT INTO bundle VALUES (NULL, "tasks", "Tasks", FALSE);
INSERT INTO bundle VALUES (NULL, "contacts", "Contacts", FALSE);
INSERT INTO bundle VALUES (NULL, "history_of_communication",
    "History of Communication", FALSE);
INSERT INTO bundle VALUES (NULL, "agenda", "Agenda", FALSE);
INSERT INTO bundle VALUES (NULL, "quotations", "Quotations", TRUE);
INSERT INTO bundle VALUES (NULL, "projects", "Projects", FALSE);
INSERT INTO bundle VALUES (NULL, "timeline", "Timeline", FALSE);
INSERT INTO bundle VALUES (NULL, "overview", "Overview", FALSE);
INSERT INTO bundle VALUES (NULL, "billing", "Billing", FALSE);
INSERT INTO bundle VALUES (NULL, "time_tracker", "Time tracker", FALSE);

----------------- team ----------------------------------------------------
INSERT INTO team VALUES (NULL, "Administrators");
INSERT INTO team VALUES (NULL, "Developers");
INSERT INTO team VALUES (NULL, "Designers");
INSERT INTO team VALUES (NULL, "Salers");
INSERT INTO team VALUES (NULL, "Interns");
INSERT INTO team VALUES (NULL, "Customers");

----------------- user -----------------------------------------------------
INSERT INTO user VALUES (NULL, "degieter", sha1("password"), 5,
    "2014-07-17", "9999-12-31");
INSERT INTO user VALUES (NULL, "beligatf", sha1("password"), 4,
    "2015-03-16", "2015-09-01");
INSERT INTO user VALUES (NULL, "yehiaoda", sha1("password"), 1,
    "2014-07-17", "9999-12-31");
INSERT INTO user VALUES (NULL, "kobenath", sha1("password"), 2,
    "2014-07-17", "9999-12-31");

----------------- membership ------------------------------------------------
INSERT INTO membership VALUES (1, 1), (1, 2), 
(2, 1), (2, 5), 
(3, 1) (3, 4),
(4, 2);

--
-- TODO use trigger and procedures according to membership to set user access
----------------- user_access -----------------------------------------------
INSERT INTO user_access VALUES 
(1, 1, "crud"), (1, 2, "crud"), (1, 3, "crud"), (1, 4, "crud"), (1, 5, "crud"), 
(1, 6, "crud"), (1, 7, "crud"), (1, 8, "crud"), (1, 9, "crud"), (1, 10, "crud"),
(1, 11, "crud"),
(2, 1, "crud"), (2, 2, "crud"), (2, 3, "crud"), (2, 4, "crud"), (2, 5, "crud"), 
(2, 6, "crud"), (2, 7, "crud"), (2, 8, "crud"), (2, 9, "crud"), (2, 10, "crud"),
(2, 11, "crud"),
(3, 1, "crud"), (3, 2, "crud"), (3, 3, "crud"), (3, 4, "crud"), (3, 5, "crud"), 
(3, 6, "crud"), (3, 7, "crud"), (3, 8, "crud"), (3, 9, "crud"), (3, 10, "crud"),
(3, 11, "crud"),
(4, 1, "f"), (4, 2, "cr"), (4, 3, "r"), (4, 4, "cr"), (4, 5, "crud"), 
(4, 6, "r"), (4, 7, "r"), (4, 8, "crud"), (4, 9, "r"), (4, 10, "f"),
(4, 11, "crud");

COMMIT;
