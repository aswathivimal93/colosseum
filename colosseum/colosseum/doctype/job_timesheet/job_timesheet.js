// Copyright (c) 2025, Blaze Technology Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on("Job Timesheet", {
    refresh: function(frm) {
        frm.add_custom_button(__("Get Employees"), function() {
			let d = new frappe.ui.Dialog({
                title: 'Select Department',
                fields: [
                    {
                        label: 'Department',
                        fieldname: 'department',
                        fieldtype: 'Link',
                        options: 'Department',  // This specifies that it's a link to the Department doctype
                        reqd: 1 // This makes it a required field
                    }
                ],
                size: 'small', // small, large, extra-large
                primary_action_label: 'Submit',
                primary_action(values) {
                    console.log(values);
                 // Fetch employees based on selected department
                 let department = values.department;

                 if (department) {
                     frappe.call({
                         method: 'frappe.client.get_list',
                         args: {
                             doctype: 'Employee',
                             filters: {
                                 department: department
                             },
                             fields: ['name', 'employee_name']
                         },
                         callback: function(r) {
                             if (r.message) {
                                 // Add employees to the child table in the form
                                 r.message.forEach(function(emp) {
                                     frm.add_child('employees', {
                                         employee_name: emp.employee_name,
                                         employee: emp.name
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