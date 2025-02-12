
frappe.ui.form.on("Job Overtime", {
    from_date: function (frm) {
        if (frm.doc.from_date && frm.doc.to_date) {
            get_employee_work_entry(frm,frm.doc.from_date,frm.doc.to_date)
        }
      
    },
    to_date: function (frm) { 
        if (frm.doc.from_date && frm.doc.to_date) {
            get_employee_work_entry(frm,frm.doc.from_date,frm.doc.to_date)
        }
      
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
                    let total_amount=3000+emp.total_ot*20;
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