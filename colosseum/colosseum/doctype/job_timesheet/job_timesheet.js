// Copyright (c) 2025, Blaze Technology Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on("Job Timesheet", {
    onload: function(frm) {
        console.log("haiiiiiiiiiiiiii");
        
        frm.add_custom_button(__("Get Employees"), function() {
          
            console.log("Hello");
        });
    }
});