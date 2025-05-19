module.exports = {
    addDays: function(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    formatDate: function(date) {
        return date.toISOString().split('T')[0];
    },

    isSameDay: function(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    },

    calculateNextDeliveryDate: function(currentDate, deliveryFrequencyInDays) {
        return this.addDays(currentDate, deliveryFrequencyInDays);
    }
};