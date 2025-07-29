import tkinter as tk
from tkinter import messagebox

def km_m_popup():
    popup= tk.Toplevel(root)
    popup.title("KM TO M")
    popup.geometry("300x150")

    tk.Label(popup, text="Enter a value", font=("Arial", 12)).pack(pady=10)
    km_entry = tk.Entry(popup, font=("Arial", 12))
    km_entry.pack(pady=5)

    result_label = tk.Label(popup, text="", font=("Arial", 12))
    result_label.pack(pady=10)

    def convert_km():
        try:
            km=float(km_entry.get())
            meters=km*1000
            result_label.config(text=f"{km} km = {meters:.2f} meters", fg="black")
        except ValueError:
            result_label.config(text="Please enter a valid number.", fg="red")
    tk.Button(popup, text="Convert", command=convert_km).pack(pady=5)
    tk.Button(popup, text="Close", command=popup.destroy).pack(pady=5)
    
def ft_m_popup():

    popup= tk.Toplevel(root)
    popup.title("ft_to_m")
    popup.geometry("300x150")
    tk.Label(popup, text="Enter a value", font=("Arial", 12)).pack(pady=10)
    ft_entry = tk.Entry(popup, font=("Arial", 12))
    ft_entry.pack(pady=5)

    result_label = tk.Label(popup, text="", font=("Arial", 12))
    result_label.pack(pady=10)

    def convert_ft():
        try:
            ft=float(ft_entry.get())
            meters=ft*0.3048
            result_label.config(text=f"{ft} ft = {meters:.2f} meters", fg="black")
        except ValueError:
            result_label.config(text="Please enter a valid number.", fg="red")
    tk.Button(popup, text="Convert", command=convert_ft).pack(pady=5)
    tk.Button(popup, text="Close", command=popup.destroy).pack(pady=5)

root = tk.Tk()
root.title("Main Window")
root.geometry("400x300")

label_title = tk.Label(root, text="This is a Unit Converter", font=("Arial", 14))
label_title.pack(pady=10)


# Go button
go_button_1 = tk.Button(root, text="KM to M", command=km_m_popup).pack(pady=10)
go_button_2 = tk.Button(root, text="FT to M", command=ft_m_popup).pack(pady=10)

root.mainloop()