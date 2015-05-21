/**
 *
 *
 */

Quotations = {
    all: [],

    init: function(callback) {
        this.readAll(function(data) {
            this.all = data.quotation;

            $("#quotations-contents").html("");

            for(var index in this.all) {
                $("#quotations-contents").loadTemplate("html/bundles/quotations/quotation-simple.html", {
                    id: this.all[index].id,
                    summary: this.all[index].summary,
                    date_of_creation: this.all[index].date_of_creation,
                }, { append: true });
            }

            if (callback)
                callback(null);
        });
    },

    display: function(id) {
        this.read(id, function(data) {
            $("#quotations-contents").html("");

            $("#quotations-contents").loadTemplate("html/bundles/quotations/quotation-details.html", {
                id: id,
                summary: data.quotation.summary,
                date_of_creation: data.quotation.date_of_creation,
                date_of_validity: data.quotation.date_of_validity,
                language: data.quotation.language,
                currency: data.quotation.currency,
                currencySymbol: data.quotation.currency_symbol,
                paymentMethod: data.quotation.payment_method,
                saler: data.vendor.first_name + ' ' + data.vendor.last_name,
                customer: data.customer.first_name + ' ' + data.customer.last_name
            }, {
                success: function() {
                    for (var index in data.details) {
                        console.log(data.details[index]);
                        $("#quotation-details").loadTemplate("html/bundles/quotations/quotation-line.html", {
                             line: data.details[index].line,
                             description: data.details[index].description,
                             discount: data.details[index].discount,
                             quantity: data.details[index].quantity,
                             price: data.details[index].price,
                             total: data.details[index].total_ht,
                        }, { append: true });
                    }
                }
            });
        })
    },

    edit: function(id) {
        this.read(id, function(data) {
            $("#quotations-contents").html("");

            $("#quotations-contents").loadTemplate("html/bundles/quotations/quotation-edit.html", {
                id: id,
                summary: data.quotation.summary,
                date_of_creation: data.quotation.date_of_creation,
                date_of_validity: data.quotation.date_of_validity,
                language: data.quotation.language,
                currency: data.quotation.currency,
                currencySymbol: data.quotation.currency_symbol,
                paymentMethod: data.quotation.payment_method,
                saler: data.vendor.first_name + ' ' + data.vendor.last_name,
                customer: data.customer.first_name + ' ' + data.customer.last_name
            }, {
                success: function() {
                    for (var index in data.details) {
                        console.log(data.details[index]);
                        $("#quotation-details").loadTemplate("html/bundles/quotations/quotation-line-form.html", {
                             line: data.details[index].line,
                             description: data.details[index].description,
                             discount: data.details[index].discount,
                             quantity: data.details[index].quantity,
                             price: data.details[index].price,
                             total: data.details[index].total_ht,
                        }, { append: true });
                    }
                }
            });
        })
    },

    pdf: function(id) {
        AlertHandler.loading("quotations");
        $("#quotations-contents").loadTemplate("html/bundles/quotations/quotation-pdf.html", {
            id: id
        }, {
            success: function() {
                $(".quotation-pdf pdf").css("height", "360px");
                new PDFObject({
                    url: "http://" + Config.server.host + ":" + Config.server.port  + "/quotation/pdf/" + id
                }).embed("pdf");
                AlertHandler.success("quotations/pdf/" + id, "");
            }
        });
    },

    readAll: function(callback) {
        AlertHandler.loading("quotations");
        $.get("http://" + Config.server.host + ":" + Config.server.port  + "/quotation/read/all", function(data) {
            AlertHandler.success("quotations/read/all", "");
            if (callback)
                callback(data);
        }, "json");
    },

    read: function(id, callback) {
        AlertHandler.loading("quotations");
        $.get("http://" + Config.server.host + ":" + Config.server.port  + "/quotation/read/" + id, function(data) {
            AlertHandler.success("quotations/read/" + id, "");
            if (callback)
                callback(data);
        }, "json");
    },

    create: function(quotation, callback) {
        AlertHandler.loading("quotations");
        AlertHandler.success("quotations/create", "");
    },

    update: function(quotation, callback) {
        AlertHandler.loading("quotations");
        AlertHandler.success("quotations/update/" + quotation.id, "");
    },

    delete: function(id, callback) {
        if (confirm("Delete quotation \"D/" + id + "\"?")) {
            AlertHandler.loading("quotations");
            $.get("http://" + Config.server.host + ":" + Config.server.port  + "/quotation/delete/" + id, function(data) {
                AlertHandler.error("quotations/delete/" + id, "");
                this.init();
                if (callback)
                    callback(data);
            }, "json");
        }
    }
}