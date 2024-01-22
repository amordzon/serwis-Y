import Swal from "sweetalert2";

export const showNotification = ({
  title,
  position,
  timer,
  background,
  color,
  timerProgressBar,
}) => {
  Swal.fire({
    toast: true,
    title: title || "Something went wrong!",
    animation: true,
    position: position || "top-end",
    showConfirmButton: false,
    timer: timer || 1000,
    background: background || "#1d9bf0",
    color: color || "white",
    timerProgressBar: timerProgressBar || false,
    padding: "0.5em 0 0.5em",
  });
};
