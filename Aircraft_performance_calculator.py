import tkinter as tk
from tkinter import messagebox
import math

root = tk.Tk()
root.title("Aircraft Performance Calculator")
root.geometry("400x300")

tk.Label(root, text="Aircraftspeed:").grid(row=0, column=0, padx=5, pady=5, sticky="e")
entry_speed = tk.Entry(root)
entry_speed.grid(row=0, column=1, padx=5, pady=5)
tk.Label(root, text="m/s").grid(row=0, column=2, padx=5, pady=5)

tk.Label(root, text="Wing area:").grid(row=1, column=0, padx=5, pady=5, sticky="e")
entry_area = tk.Entry(root)
entry_area.grid(row=1, column=1, padx=5, pady=5)
tk.Label(root, text="m^2").grid(row=1, column=2, padx=5, pady=5)

tk.Label(root, text="Airdensity:").grid(row=2, column=0, padx=5, pady=5, sticky="e")
entry_density = tk.Entry(root)
entry_density.grid(row=2, column=1, padx=5, pady=5)
tk.Label(root, text="kg/m^3").grid(row=2, column=2, padx=5, pady=5)

tk.Label(root, text="Lift coefficient:").grid(row=3, column=0, padx=5, pady=5, sticky="e")
entry_coefficient = tk.Entry(root)
entry_coefficient.grid(row=3, column=1, padx=5, pady=5)

tk.Label(root, text="Aircraft Weight:").grid(row=4, column=0, padx=5, pady=5, sticky="e")
entry_weight = tk.Entry(root)
entry_weight.grid(row=4, column=1, padx=5, pady=5)
tk.Label(root, text="N").grid(row=4, column=2, padx=5, pady=5)

def calculate():
        try:
            # Get values from entries
            V = float(entry_speed.get())
            S = float(entry_area.get())
            rho = float(entry_density.get())
            CL = float(entry_coefficient.get())
            W = float(entry_weight.get())

            # Calculate lift
            L = 0.5 * rho * V**2 * S * CL

            # Stall speed
            V_stall = math.sqrt((2 * W) / (rho * S * CL))

            popup = tk.Toplevel(root)
            popup.title("Output")
            popup.geometry("300x150")

            # Show results in the new popup window
            tk.Label(popup, text=f"Lift: {L:.2f} N").pack(pady=5)
            tk.Label(popup, text=f"Stall Speed: {V_stall:.2f} m/s").pack(pady=5)

            if L >= W:
               status = "Enough Lift "
               color = "green"
            else:
               status = "Not Enough Lift "
               color = "red"

            tk.Label(popup, text=f"Flight Status: {status}", fg=color).pack(pady=5)

        except ValueError:
           messagebox.showerror("Invalid Input", "Please enter valid numbers.")

go_button_1 = tk.Button(root, text="Enter", command=calculate)
go_button_1.grid(row=5, column=1, pady=10)        

root.mainloop()