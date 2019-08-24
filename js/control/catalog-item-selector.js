'use strict'

class CatalogItemSelector {
    catalogSelectId;
    catalogItemSelectId;
    siteController;

    constructor (catalogSelectId, catalogItemSelectId, siteController) {
        this.catalogSelectId = catalogSelectId;
        this.catalogItemSelectId = catalogItemSelectId;
        this.siteController = siteController;

        $("#" + this.catalogSelectId).change(() => {
            let value = $("#" + this.catalogSelectId).val();
            if (value === "no-value") {
                this.clearCatalogItemSelector();
                return;
            }
            this.setSelectedCatalog(value);
        });

        $("#" + this.catalogItemSelectId).change(() => {
            let value = $("#" + this.catalogItemSelectId).val();
            if (value === "no-value") {
                return;
            }
            value = Number(value);
            this.siteController.selectItem(this, value);
        });
    }

    clearCatalogSelector () {
        let selector = $("#" + this.catalogSelectId);
        selector.empty();
        selector.append($("<option>", {
            value: "no-value",
            text: "Catalog"
        }));
    }

    clearCatalogItemSelector () {
        let selector = $("#" + this.catalogItemSelectId);
        selector.empty();
        selector.append($("<option>", {
            value: "no-value",
            text: "Catalog Item"
        }));
    }

    clear () {
        this.clearCatalogSelector ();
        this.clearCatalogItemSelector ();

        $("#" + this.catalogSelectId).prop("disabled", true);
        $("#" + this.catalogItemSelectId).prop("disabled", true);
    }

    noImage () {
        this.clear ();
    }

    dataLoaded() {
        $("#" + this.catalogSelectId).prop("disabled", false);
        $("#" + this.catalogItemSelectId).prop("disabled", false);
        this.clearCatalogSelector();

        let catalogSelector = $("#" + this.catalogSelectId);

        for (let attribute of CatalogItem.idAttributes) {
            catalogSelector.append($("<option>", {
                value: attribute.id,
                text: attribute.title
            }));
        }

        this.clearCatalogItemSelector();
    }

    setSelectedCatalog (attributeId) {
        this.clearCatalogItemSelector();

        let catalogItemSelector = $("#" + this.catalogItemSelectId);
        for(let item of this.siteController.image.items) {
            if (item.getValueById(attributeId) === undefined) {
                continue;
            }
            catalogItemSelector.append($("<option>", {
                value: item.getId(),
                text: item.getValueById(attributeId)
            }));
        }
    }

    setSelectedItem (caller, item) {
        if (caller === this) {
            return;
        }
        if (item == undefined) {
            $("#" + this.catalogSelectId).val("no-value");
            $("#" + this.catalogItemSelectId).val("no-value");
            return;
        }
        let idAttribute = item.getBestIdAttribute();
        if (idAttribute == undefined) {
            this.clear();
        } else {
            $("#" + this.catalogSelectId).val(idAttribute.id);
            this.setSelectedCatalog (idAttribute.id);
            $("#" + this.catalogItemSelectId).val(item.getId());
        }
    }

    overlayEnabled (enabled) {
    }
}
