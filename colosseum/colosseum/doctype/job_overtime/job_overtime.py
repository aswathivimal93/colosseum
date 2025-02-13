# Copyright (c) 2025, Blaze Technology Solutions and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate


class JobOvertime(Document):
	pass


@frappe.whitelist()
def get_employee_work_summary(from_date, to_date):
    from_date = getdate(from_date)
    to_date = getdate(to_date)
    print(from_date)
    print(to_date)


    # Fetch work summary (total hours and overtime) for each employee within the date range
    employees = frappe.db.sql("""
        SELECT te.employee, te.employee_name, 
               SUM(te.total_hours) as total_hours, 
               SUM(te.ot) as total_ot 
        FROM `tabJob Employee` te
        JOIN `tabJob Timesheet` t ON te.parent = t.name
        WHERE t.date BETWEEN %s AND %s
        GROUP BY te.employee, te.employee_name
    """, (from_date, to_date), as_dict=True)
    
    employee_ids = [emp["employee"] for emp in employees]
    print("employee_id")
    print(employees)
    salary_dict = {}  # Initialize salary_dict as an empty dictionary

    if employee_ids:
        # Fetch salary structure details for employees
        salary_structures = frappe.db.sql("""
            SELECT employee, salary_structure, base, from_date
            FROM `tabSalary Structure Assignment`
            WHERE employee IN ({})
              AND from_date <= %s
            ORDER BY from_date DESC
        """.format(",".join(["%s"] * len(employee_ids))), tuple(employee_ids) + (to_date,), as_dict=True)
        
        print(salary_structures)
        # Create a dictionary of the latest salary structure for each employee
        for emp in employees:
            emp["basic_salary"] = 0
            for salary in salary_structures:
                if emp["employee"] == salary["employee"] and to_date >= salary["from_date"]:
                    emp["basic_salary"] = salary["base"]
                    break 
    print("employees after salary")
    print(employees)

    return employees