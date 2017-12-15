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
var ConfirmationViewLowBand = require('component/confirmation/low-bandwidth/confirmation.low-bandwidth.view');

module.exports = Marionette.LayoutView.extend({
    tagName: CustomElements.register('low-bandwidth-map'),
    template: template,
    regions: {
        mapContainer: '> .map-container'
    },

    // confirmationView3D: ConfirmationView.generateConfirmation({
    //     prompt: 'You are in low bandwidth mode. Would you like to display the 3D Map? ',
    //     yes: 'Sure',
    //     no: 'Nah'
    // }),

    // confirmationView2D: ConfirmationView.generateConfirmation({
    //     prompt: 'You are in low bandwidth mode. Would you like to display the 2D Map? ',
    //     yes: 'Sure',
    //     no: 'Nah'
    // }),

    confirmationView: function() { 
        return ConfirmationViewLowBand.generateConfirmation({}) 
    },

    initialize: function(options) {
        this.options = options;
        // this.listenTo(this.confirmationView3D, 'change:choice', function(){
        //     console.log('For 3D map, the user chose ' + String(this.confirmationView3D.get('choice')));
        //     lowBandwidthMapModel.set({'3DMap': this.confirmationView3D.get('choice')});
        // });
        // this.listenTo(this.confirmationView2D, 'change:choice', function(){
        //     console.log('For 2D map, the user chose ' + String(this.confirmationView2D.get('choice')));
        //     lowBandwidthMapModel.set({'2DMap': this.confirmationView2D.get('choice')});
        // });
        console.log('Inside low-bandwidth-map view: lowBandwidth = ' + String(this.options.lowBandwidth) + ', desiredContainer = ' + String(this.options.desiredContainer));
        if (this.options.lowBandwidth) {
            this.listenTo(this.confirmationView(), 'change:choice', function() {
                switch(this.confirmationView.get('choice')) {
                    case 'neither':
                        console.log('The user chose neither');
                        this.mapContainer.show(new InspectorView(this.options));
                        break;
                    case '2D':
                        console.log('The user chose 2D');
                        this.mapContainer.show(new OpenlayersView(this.options));
                        break;
                    case '3D':
                        console.log('The user chose 3D');
                        this.mapContainer.show(new CombinedMapView(this.options));
                        break;
                }
            });
        } else {
            switch(this.options.desiredContainer) {
                case 'cesium':
                    this.mapContainer.show(new CombinedMapView(this.options));
                    break;
                case 'openlayers':
                    this.mapContainer.show(new OpenlayersView(this.options));
                    break;
            }
        }
    },

    onRender: function(){
        // console.log('Inside low-bandwidth-map-view, the low bandwidth option is ' + String(this.options.lowBandwidth));
        // console.log('Inside low-bandwidth-map-view, the original desired map is ' + String(this.options.desiredContainer));
        // console.log('Inside low-bandwidth-map-view, 3D Map choice is ' + String(lowBandwidthMapModel.get('3DMap')));
        // console.log('Inside low-bandwidth-map-view, 2D Map choice is ' + String(lowBandwidthMapModel.get('2DMap')));
        // if (this.options.lowBandwidth && !lowBandwidthMapModel.get('3DMap') && !lowBandwidthMapModel.get('2DMap')) {
        //     this.mapContainer.show(new InspectorView(this.options));
        //     //this.mapContainer.show(new InspectorView(this.options));
        // } else {
        //     this.mapContainer.show(new CombinedMapView(this.options));
        // }
    }
});