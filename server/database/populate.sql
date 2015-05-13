------------------------------------------------
--- Populate the database with example value ---
------------------------------------------------
USE AMON;

START TRANSACTION;

----------------- language ---------------------------------------
INSERT INTO language VALUES ("fr-CH", "Français");
INSERT INTO language VALUES ("en-UK", "English");

----------------- title ------------------------------------------
INSERT INTO title VALUES (null);
INSERT INTO title VALUES (null);

----------------- title_translation -------------------------------
INSERT INTO title_translation VALUES (null, "M.", "fr-CH", 1);
INSERT INTO title_translation VALUES (null, "Mr.", "en-UK", 1);
INSERT INTO title_translation VALUES (null, "Mme.", "fr-CH", 2);
INSERT INTO title_translation VALUES (null, "Mrs.", "en-UK", 2);

----------------- contact -----------------------------------------
INSERT INTO contact VALUES (null, 1, "Oday", "Yehia",
    "oday.yehia@net-production.ch", "Avenue de la Chablière 24, 1003 Lausanne, SUISSE");
INSERT INTO contact VALUES (null, 1, "Nathan", "Köbe",
    "nathan.kobe@net-production.ch", "address");
INSERT INTO contact VALUES (null, 2, "Mélanie", "Begg", "email@email",
    "adresse");
INSERT INTO contact VALUES (null, 1, "François-Xavier", "Béligat",
    "beligat.fx@gmail.com", "12 rue de la Basilique, 25000 Besançon, FRANCE");
INSERT INTO contact VALUES (null, 1, "Antoine", "De Gieter",
    "antoine.degieter@net-production.ch", "Montrinsans route de Malpas, 25160 Labergement Sainte-Marie, FRANCE");

------------------ phone ------------------------------------------
INSERT INTO phone VALUES (null, 41, "79 193 33 09");
INSERT INTO phone VALUES (null, 41, "77 124 21 84");

------------------ contact_phone ----------------------------------
INSERT INTO contact_phone VALUES (1,1);
INSERT INTO contact_phone VALUES (3,2);

----------------- payment_method ----------------------------------
INSERT INTO payment_method VALUES (null);

----------------- payment_method_translation -----------------------
INSERT INTO payment_method_translation VALUES (null, "Carte Bancaire", "fr-CH", 1);
INSERT INTO payment_method_translation VALUES (null, "Credit Card", "en-UK", 1);

----------------- currency ---------------------------------------
INSERT INTO currency VALUES (null, "€");
INSERT INTO currency VALUES (null, "CHF");

---------------- currency_translation ----------------------------
INSERT INTO currency_translation VALUES (null, 1, "fr-CH", "Euros");
INSERT INTO currency_translation VALUES (null, 1, "en-UK", "Euros");
INSERT INTO currency_translation VALUES (null, 2, "fr-CH", "Francs Suisses");
INSERT INTO currency_translation VALUES (null, 2, "en-UK", "Swiss Francs");

----------------- misc -------------------------------------------
INSERT INTO misc VALUES ("quotation", "fr-CH", "Devis");
INSERT INTO misc VALUES ("quotation", "en-UK", "Quotation");
INSERT INTO misc VALUES ("validity", "fr-CH", "Date limite de validité");
INSERT INTO misc VALUES ("validity", "en-UK", "Valid until");
INSERT INTO misc VALUES ("currency", "fr-CH", "Devise");
INSERT INTO misc VALUES ("currency", "en-UK", "Currency");

INSERT INTO misc VALUES ("description", "fr-CH", "Désignation");
INSERT INTO misc VALUES ("description", "en-UK", "Description");
INSERT INTO misc VALUES ("discount", "fr-CH", "Réduction");
INSERT INTO misc VALUES ("discount", "en-UK", "Discount");
INSERT INTO misc VALUES ("quantity", "fr-CH", "Quantité");
INSERT INTO misc VALUES ("quantity", "en-UK", "Quantity");
INSERT INTO misc VALUES ("price", "fr-CH", "Prix");
INSERT INTO misc VALUES ("price", "en-UK", "Price");
INSERT INTO misc VALUES ("total", "fr-CH", "Total HT");
INSERT INTO misc VALUES ("total", "en-UK", "Total excl tax");

INSERT INTO misc VALUES ("payment_method", "fr-CH", "Mode de règlement");
INSERT INTO misc VALUES ("payment_method", "en-UK", "Payment method");
INSERT INTO misc VALUES ("to_pay", "fr-CH", "À payer");
INSERT INTO misc VALUES ("to_pay", "en-UK", "To pay");
INSERT INTO misc VALUES ("vendor", "fr-CH", "Vendeur");
INSERT INTO misc VALUES ("vendor", "en-UK", "Vendor");
INSERT INTO misc VALUES ("customer", "fr-CH", "Client");
INSERT INTO misc VALUES ("customer", "en-UK", "Customer");
INSERT INTO misc VALUES ("signature", "fr-CH", 
    "Date et signature précédées de la mention 'Bon pour accord'");
INSERT INTO misc VALUES ("signature", "en-UK", 
    "Date and signature preceded by the words 'Signed as agreed'");

----------------- detail -------------------------------------------
INSERT INTO detail VALUES (null, "Application : Accueil", 10, 1, 2000, 1);
INSERT INTO detail VALUES (null, "Application : À Propos", 10, 1, 400, 2);
INSERT INTO detail VALUES (null, "Application : Paiement", 10, 1, 250, 3);

----------------- quotation --------------------------------------
INSERT INTO quotation VALUES (null, "Refonte complète du site internet www.arrowstudio.ch", 
    1, 3, 1, 2, "2015-05-01", "2015-06-01");


----------------- quotation_detail ----------------------------------------
INSERT INTO quotation_detail VALUES (1, 1);
INSERT INTO quotation_detail VALUES (1, 2);
INSERT INTO quotation_detail VALUES (1, 3);

----------------- access_key ----------------------------------------------
INSERT INTO access_key VALUES (null, "users_and_roles");
INSERT INTO access_key VALUES (null, "tasks");
INSERT INTO access_key VALUES (null, "self_tasks");
INSERT INTO access_key VALUES (null, "contacts");
INSERT INTO access_key VALUES (null, "history_of_communication");
INSERT INTO access_key VALUES (null, "agenda");
INSERT INTO access_key VALUES (null, "quotations");
INSERT INTO access_key VALUES (null, "projects");
INSERT INTO access_key VALUES (null, "timeline");
INSERT INTO access_key VALUES (null, "overview");
INSERT INTO access_key VALUES (null, "billing");

----------------- team ----------------------------------------------------
INSERT INTO team VALUES (null, "Administrators");
INSERT INTO team VALUES (null, "Developers");
INSERT INTO team VALUES (null, "Designers");
INSERT INTO team VALUES (null, "Salers");
INSERT INTO team VALUES (null, "Interns");
INSERT INTO team VALUES (null, "Customers");

----------------- user -----------------------------------------------------
INSERT INTO user VALUES (null, "degieter", sha1("password"), sha1(""), 5,
    "2014-07-17", "9999-12-31");
INSERT INTO user VALUES (null, "beligatf", sha1("password"), sha1(""), 4,
    "2015-03-16", "2015-09-01");
INSERT INTO user VALUES (null, "yehiaoda", sha1("password"), sha1(""), 1,
    "2014-07-17", "9999-12-31");
INSERT INTO user VALUES (null, "kobenath", sha1("password"), sha1(""), 2,
    "2014-07-17", "9999-12-31");


COMMIT;
