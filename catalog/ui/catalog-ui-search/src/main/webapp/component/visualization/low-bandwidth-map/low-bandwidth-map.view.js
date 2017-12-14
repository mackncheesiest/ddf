/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global require, window*/
var _ = require('underscore');
var $ = require('jquery');
var wreqr = require('wreqr');
var template = require('./low-bandwidth-map.hbs');
var Marionette = require('marionette');
var CustomElements = require('js/CustomElements');
var CombinedMapView = require('component/visualization/combined-map/combined-map.view');
var OpenlayersView = require('component/visualization/maps/openlayers/openlayers.view');
var InspectorView = require('component/visualization/inspector/inspector.view');
var Common = require('js/Common');
var store = require('js/store');
var user = require('component/singletons/user-instance');
var featureDetection = require('component/singletons/feature-detection');
var router = require('component/router/router');
var lowBandwidthMapModel = require('component/visualization/low-bandwidth-map/low-bandwidth-map.model');
var ConfirmationView = require('component/confirmation/confirmation.view');

module.exports = Marionette.LayoutView.extend({
    tagName: CustomElements.register('low-bandwidth-map'),
    template: template,
    regions: {
        mapContainer: '> .map-container',
        promptUserContainer: '> .prompt-user-container'
    },
    events: {
        "click > .accept-user-container": "acceptedConditions" 
    },

    acceptedConditions: function(event) {
        //In theory update a model which triggers the view to refresh
        lowBandwidthMapModel.set({userAcknowledged: true});
        console.log('The user accepted the conditions');
    },

    initialize: function(options) {
        this.options = options;
    },

    onRender: function(){
        console.log('Inside low-bandwidth-map-view, the low bandwidth option is ' + String(this.options.lowBandwidth));
        console.log('Inside low-bandwidth-map-view, the original desired map is ' + String(this.options.desiredContainer));
        console.log('Inside low-bandwidth-map-view, clickedOk is ' + String(lowBandwidthMapModel.get('userAcknowledged')));
        if (this.options.lowBandwidth && !lowBandwidthMapModel.get('userAcknowledged')) {
            this.mapContainer.show(new InspectorView(this.options));
            //this.promptUserContainer.show(new ConfirmationView(

            //))
            this.listenTo(ConfirmationView.generateConfirmation({
                prompt: 'You are in low bandwidth mode. Would you like to display the 3D Map? ' +
                'Please use the left navigation to go somewhere else.',
                yes: 'Okay'
            }),
            'change:choice',
            function(){
            });
            //this.mapContainer.show(new InspectorView(this.options));
        } else {
            this.mapContainer.show(new CombinedMapView(this.options));
            this.promptUserContainer.empty();
        }
    }
});