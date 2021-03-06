var bookshelf = require('../libs/db').bookshelf;
var bcrypt = require('bcrypt-nodejs');
var constants = require('./constants.js');

var Event = bookshelf.Model.extend({

    tableName: constants.EVENTS_TABLE_NAME,
    idAttribute: 'event_id',

    generateGateCode: function (code) {
        this.attributes.password = bcrypt.hashSync(code, bcrypt.genSaltSync(8), null);
    },
    loadProps: function() {
        // this.attributes.json_data;
    }

}, {
    
    /**
     * Returns event by id if found in constants.events object
     * if the event does not exists it will return the database
     * version and save it locally to the constants
     * @param { String } id
     * @returns {Promise<any>}
     */
    get_event: id => {
        return Event.where('event_id', id).fetch()
            .then(response => {
                return response.attributes
            }).then(event => {
                event.addinfo_json = JSON.parse(event.addinfo_json);
                return event;
            }).catch(response => { 
                return null;
            })
    },

    get_event_controllDates: id => {
        return Event.where('event_id', id).fetch()
            .then(response => {
                return JSON.parse(response.attributes.addinfo_json);
            }).then(addinfo => {
                const allocation_start = addinfo.appreciation_tickets_allocation_start;
                const allocation_end = addinfo.appreciation_tickets_allocation_end;
                const campEditlastDate = addinfo.edit_camps_lastDate;
                const controllDates = {
                    appreciation_tickets_allocation_start : allocation_start ? new Date(allocation_start) : null,
                    appreciation_tickets_allocation_end : allocation_end ? new Date(allocation_end) : null,
                    edit_camps_lastDate : campEditlastDate ? new Date(campEditlastDate) : null, 
                }
                return controllDates;
            }).catch(response => { 
                return null;
            })
    }
});

module.exports = {
    Event: Event
};
