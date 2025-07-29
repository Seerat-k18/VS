import tkinter as tk
from tkinter import messagebox

def show_popup():
    popup = tk.Toplevel(root)
    popup.title("Messagebox")
    popup.geometry("300x150")
    tk.Label(popup, text ="Hi STAVROS!", font = ("Arial",12)).pack(pady=20)
    tk.Button(popup, text="Close", command=popup.destroy).pack()
root = tk.Tk()
root.title("Main Window")
root.geometry("400x300")

tk.Button(root, text="Press here", command=show_popup).pack(pady=10)

root.mainloop()
