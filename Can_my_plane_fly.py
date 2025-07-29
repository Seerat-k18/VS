import tkinter as tk
from tkinter import messagebox

def P_L_popup(): #Pilot and cargo
    popup= tk.Toplevel(root)
    popup.title("Value")
    popup.geometry("300x150")

    go_button_2 = tk.Button(popup, text="Pilot and Cargo", command=popup.destroy).pack()


def Fuel_popup(): 
    popup= tk.Toplevel(root)
    popup.title("Value")
    popup.geometry("300x150")

    go_button_3 = tk.Button(popup, text="Fuel", command=popup.destroy).pack()
   

def Runway_popup(): 
    popup= tk.Toplevel(root)
    popup.title("Value")
    popup.geometry("300x150")

    go_button_4 = tk.Button(popup, text="Runway", command=popup.destroy).pack()

def Weather_popup(): 
    popup= tk.Toplevel(root)
    popup.title("Value")
    popup.geometry("300x150")

    go_button_5 = tk.Button(popup, text="Weather", command=popup.destroy).pack()

def Specs_popup(): #Aircraft specs
    popup= tk.Toplevel(root)
    popup.title("Value")
    popup.geometry("300x150")

    go_button_6 = tk.Button(popup, text="Aircraft Specs", command=popup.destroy).pack()

    

root = tk.Tk()
root.title("Main Window")
root.geometry("400x300")

label_title = tk.Label(root, text="Can your plane fly", font=("Arial", 14))
label_title.pack(pady=10)

go_button_1 = tk.Button(root, text="Start", command=P_L_popup).pack(pady=10)



root.mainloop()