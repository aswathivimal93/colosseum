// Copyright (c) 2025, Blaze Technology Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on("Job Timesheet", {
    refresh: function(frm) {
        frm.add_custom_button(__("Get Employees"), function() {
            // Clear the child table before opening the dialog
            frm.clear_table('employees');
			let d = new frappe.ui.Dialog({
                title: 'Select Department',
                fields: [
                    {
                        label: 'Department',
                        fieldname: 'department',
                        fieldtype: 'Link',
                        options: 'Department',  // This specifies that it's a link to the Department doctype
                        reqd: 1 // This makes it a required field
                    },
                    {
                        label: 'Start Time',
                        fieldname: 'start_time',
                        fieldtype: 'Time',
                        reqd: 1 // This makes it a required field
                    },
                    {
                        label: 'End Time',
                        fieldname: 'end_time',
                        fieldtype: 'Time',
                        reqd: 1 // This makes it a required field
                    }
                ],
                
                size: 'small', // small, large, extra-large
                primary_action_label: 'Submit',
                primary_action(values) {
                 // Fetch employees based on selected department
                    let department = values.department;
                    let start_time = values.start_time;
                    let end_time = values.end_time;

                    if (department) {
                        frappe.call({
                            method: "colosseum.colosseum.doctype.job_timesheet.job_timesheet.get_employees",
                            args: {
                             department: department
                            },
                        callback: function(r) {
                            if (r.message) {
                                 // Add employees to the child table in the form
                                r.message.forEach(function(emp) {
                                    let worked_hours = calculate_total_hours_and_ot(start_time, end_time);
                                    frm.add_child('employees', {
                                        employee_name: emp.employee_name,
                                        employee: emp.name,
                                        start_time:start_time,
                                        end_time:end_time,
                                        total_hours: worked_hours.total_hours,
                                        ot: worked_hours.ot
                                        
                                     });
                                 });

                                 // Refresh the child table to show the added employees
                                 frm.refresh_field('employees');
                             }
                         }
                     });
                    d.hide();  // Hide the dialog after submit
                }
            }
            }); 
            d.show();
		 })
    }
});

frappe.ui.form.on("Job Employee", {
    // Trigger calculation when end_time is entered/changed
    end_time: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];  // Access the current row
        if (row.start_time && row.end_time) {
            let total_values = calculate_total_hours_and_ot(row.start_time, row.end_time);
            frappe.model.set_value(cdt, cdn, "total_hours", total_values.total_hours);
            frappe.model.set_value(cdt, cdn, "ot", total_values.ot); 
        }
        frm.refresh_field('employees');  
    }
});

// Function to calculate total_hours and ot
function calculate_total_hours_and_ot(start_time, end_time) {
    let total_hours = 0;
    let ot = 0;

    if (start_time && end_time) {
        let worked_seconds = time_diff_in_seconds(start_time, end_time);
        total_hours = worked_seconds / 3600;  // Convert seconds to hours

        // Calculate overtime: OT for hours greater than 8
        ot = Math.max(total_hours - 8, 0);  
    }

    return {
        "total_hours": total_hours,
        "ot": ot
    };
}

// Function to calculate time difference in seconds
function time_diff_in_seconds(start_time, end_time) {
    let start = new Date(`1970-01-01T${start_time}Z`);
    let end = new Date(`1970-01-01T${end_time}Z`);
    let diff_in_seconds = (end - start) / 1000;  // Convert to seconds
    console.log(diff_in_seconds)
    return diff_in_seconds;
}



