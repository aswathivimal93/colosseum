
frappe.ui.form.on("Job Overtime", {
    refresh: function (frm) {
        frm.add_custom_button(__("Get Employees"), function () {
            // Clear the child table before opening the dialog
            frm.clear_table('employees');
            get_employee_work_entry(frm,frm.doc.from_date,frm.doc.to_date)
        });
    }
});
function get_employee_work_entry(frm,from_date,to_date)
{
    frappe.call({
        method: "colosseum.colosseum.doctype.job_overtime.job_overtime.get_employee_work_summary",
        args: {
            from_date: from_date,
            to_date: to_date
        },
        callback: function (r) {
            if (r.message) {
                frm.clear_table('employees');
                r.message.forEach(function (emp) {
                    console.log("data")
                    console.log(emp)
                    let total_amount=(emp.basic_salary/240)*1.5*emp.total_ot;
                    frm.add_child('employees', {
                        employee_name: emp.employee_name,
                        total_hours: emp.total_hours,
                        total_ot: emp.total_ot,
                        amount:total_amount,
                        //total_hours: worked_hours.total_hours,
                        //ot: worked_hours.ot

                    });
                });

                // Refresh the child table to show the added employees
                frm.refresh_field('employees');
            }
        }
    });
}