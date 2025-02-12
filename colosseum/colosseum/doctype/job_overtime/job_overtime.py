# Copyright (c) 2025, Blaze Technology Solutions and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class JobOvertime(Document):
	pass


@frappe.whitelist()
def get_employee_work_summary(from_date, to_date):
    frappe.msgprint("py function")
    employees  = frappe.db.sql("""
        SELECT employee_name, 
               SUM(total_hours) as total_hours, 
               SUM(ot) as total_ot 
        FROM `tabJob Employee`
        WHERE creation BETWEEN %s AND %s
        GROUP BY employee_name
    """, (from_date, to_date), as_dict=True)
    if employees:
        for i in employees:  
          frappe.msgprint(i.employee_name)
    return employees

