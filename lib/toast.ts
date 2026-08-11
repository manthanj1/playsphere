import toast from "react-hot-toast";

export const showToast = (message: string, type: "success" | "error" = "success") => {
  if (type === "success") {
    toast.success(message, {
      style: {
        border: '1px solid #c3c5d9',
        padding: '16px',
        color: '#0b1c30',
        background: '#ffffff',
      },
      iconTheme: {
        primary: '#003ec7',
        secondary: '#ffffff',
      },
      duration: 3000,
    });
  } else {
    toast.error(message, {
      style: { 
        border: '1px solid #ff4b4b', 
        padding: '16px', 
        color: '#0b1c30', 
        background: '#ffffff' 
      },
      duration: 3000,
    });
  }
};
