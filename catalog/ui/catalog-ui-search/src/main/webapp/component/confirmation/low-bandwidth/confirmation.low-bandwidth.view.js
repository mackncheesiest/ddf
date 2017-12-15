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
/*global define*/
define([
    'marionette',
    'underscore',
    'jquery',
    './confirmation.low-bandwidth.hbs',
    '../confirmation.view',
    'js/CustomElements',
    'component/dropdown/dropdown.view',
    'component/dropdown/dropdown'
], function (Marionette, _, $, template, ConfirmationView,
         CustomElements, DropdownView, DropdownModel) {

    return ConfirmationView.extend({
        template: template,
        className: 'is-low-bandwidth',
        modelEvents: {
            'change:choice': 'close'
        },
        events: {
            'click': 'handleOutsideClick',
            'click .confirmation-neither': 'handleNeither',
            'click .confirmation-2D': 'handle2D',
            'click .confirmation-3D': 'handle3D',
            'mousedown': 'handleMousedown'
        },
        handleMousedown: function(e){
            e.stopPropagation();
        },
        handleNeither: function() {
            this.model.makeChoice('neither');
        },
        handle2D: function(){
            this.model.makeChoice('2D');
        },
        handle3D: function(){
            this.model.makeChoice('3D');
        }
    });
});