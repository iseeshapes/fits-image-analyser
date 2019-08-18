'use strict'

class StarSelector {
    catalogSelectorId;
    catalogItemSelectorId;
    siteController;

    constructor (catalogSelectorId, catalogItemSelectorId, siteController) {
        this.catalogSelectorId = catalogSelectorId;
        this.catalogItemSelectorId = catalogItemSelectorId;
        this.siteController = siteController;

        $("#" + this.catalogSelectorId).change(() => {
            let value = $("#" + this.catalogSelectorId).val();
            if (value === "no-value") {
                this.clearCatalogItemSelector();
                return;
            }
            this.setSelectedCatalog(value);
        });

        $("#" + this.catalogItemSelectorId).change(() => {
            let value = $("#" + this.catalogItemSelectorId).val();
            if (value === "no-value") {
                return;
            }
            value = Number(value);
            this.siteController.selectItem(this, value);
        });
    }

    clearCatalogSelector () {
        let selector = $("#" + this.catalogSelectorId);
        selector.empty();
        selector.append($("<option>", {
            value: "no-value",
            text: "Catalog"
        }));
    }

    clearCatalogItemSelector () {
        let selector = $("#" + this.catalogItemSelectorId);
        selector.empty();
        selector.append($("<option>", {
            value: "no-value",
            text: "Star"
        }));
    }

    dataLoaded() {
        this.clearCatalogSelector();

        let catalogSelector = $("#" + this.catalogSelectorId);

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

        let catalogItemSelector = $("#" + this.catalogItemSelectorId);
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
        $("#" + this.catalogSelectorId).val("no-value");
        this.clearCatalogItemSelector();
    }
}
