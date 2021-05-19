const getMenuFontEnd = (usuarioRole = 'USER_ROLE') => { //DEFINIMOS UN VALOR POR DEFECTO

    const menu = [{
            titulo: 'Dashboard',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Main', url: '/' },
                { titulo: 'Grafica', url: '/dashboard/grafica1' },
                { titulo: 'RXJS', url: '/dashboard/rxjs' },
                { titulo: 'Promesas', url: '/dashboard/promesas' },
                { titulo: 'ProgressBar', url: '/dashboard/progress' },
            ]
        },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                //{ titulo: 'Usuarios', url: '/dashboard/usuarios' },
                { titulo: 'Hospitales', url: '/dashboard/hospitales' },
                { titulo: 'Medicos', url: '/dashboard/medicos' },
            ]
        },
    ];

    if (usuarioRole === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/dashboard/usuarios' })
    }

    return menu;
}

module.exports = {
    getMenuFontEnd
}