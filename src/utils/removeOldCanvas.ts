// Bugfix hack...
export default function removeOldCanvas() {
    const canvas = document.querySelector('canvas');
    if (canvas) {
        window.location.replace('/')
    }
}
