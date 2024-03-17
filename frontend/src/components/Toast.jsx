import Swal from 'sweetalert2';

export const showToast = (icon, title) => {
  Swal.fire({
    toast: true,
    icon: icon,
    title: title,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
}

