# Copyright (c) 2025, Blaze Technology Solutions and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import time_diff_in_seconds
from datetime import datetime


class JobTimesheet(Document):
    """ def before_insert(self):
        self.handle_child_table_changes()

    def on_update(self):
        self.handle_child_table_changes()

    def handle_child_table_changes(self):
        # Check if employees table has rows
        for emp in self.employees:
            if not emp.get('start_time') or not emp.get('end_time'):
                continue
            # Perform your calculations or operations on the child table row here
            self.calculate_total_hours_and_ot(emp)

    def calculate_total_hours_and_ot(self, emp):
        # Custom calculation logic for each child row
        start_time = emp.start_time
        end_time = emp.end_time

        # Perform your time calculations here
        if start_time and end_time:
            worked_seconds = self.time_diff_in_seconds(start_time, end_time)
            worked_hours = worked_seconds / 3600  # Convert seconds to hours
            emp.total_hours = worked_hours
            emp.ot = max(worked_hours - 8, 0)  # Example OT calculation
        return {
        "total_hours": worked_hours,
        "ot":emp.ot
    }

    def time_diff_in_seconds(self, start_time, end_time):
        time_format = "%H:%M:%S"
        start = datetime.strptime(start_time, time_format)
        end = datetime.strptime(end_time, time_format)
        return (end - start).seconds """
    

@frappe.whitelist()  # This makes the function accessible from JavaScript
def get_employees(department):
    if not department:
        frappe.throw("please provide a department!")
    employees=frappe.get_all("Employee",filters={"department":department},fields=["name", "employee_name"]) 

    if not employees:
        frappe.msgprint("No Employees Found in the department.")

    return employees