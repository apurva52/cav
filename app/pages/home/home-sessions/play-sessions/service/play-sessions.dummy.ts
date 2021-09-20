import { SessionPanelData } from './play-sessions.model';

export const PLAY_SESSIONS_DUMMY: SessionPanelData = {
    panels: [
        {
            label: 'Home Page',
            duration: '25 Jul @5:30 2s PM',
            collapsed: false,
            menuOption: true,
            accordion: [
                {
                    label: "Index/Women",
                    duration: '25 Jul @5:30 2s PM',
                    iconTriangle: true,
                    iconcursor: true,
                    iconmenu: false,
                    color: '#53b771',
                    details: [
                        {
                            url: 'httts://www.kohis.com',
                            refUrl: 'null',
                            loadTime: '',
                            dom: '',
                            renderTime: '',
                            byteTime: ''
                        }
                    ]
                },
                {
                    label: "Running",
                    duration: '25 Jul @5:30 2s PM',
                    iconTriangle: true,
                    iconcursor: true,
                    iconmenu: true,
                    color: '#ff4646'
                },
            ]
        },

        {
            label: 'Running/Women',
            duration: '25 Jul @5:30 2s PM',
            collapsed: false,
            menuOption: false,
            accordion: [
                {
                    label: "Select Size",
                    duration: '25 Jul @5:30 2s PM',
                    iconTriangle: true,
                    iconcursor: true,
                    iconmenu: false,
                    color: '#53b771',
                    details: [
                        {
                            url: 'httts://www.kohis.com',
                            refUrl: 'null',
                            loadTime: '',
                            dom: '',
                            renderTime: '',
                            byteTime: ''
                        }
                    ]
                },
                {
                    label: "Add to Cart",
                    duration: '25 Jul @5:30 2s PM',
                    iconTriangle: true,
                    iconcursor: true,
                    iconmenu: true,
                    color: '#ff4646'
                },
            ]
        },
        {
            label: 'Running/Women/Shoes',
            duration: '25 Jul @5:30 2s PM',
            collapsed: false,
            menuOption: true,
            accordion: [
                {
                    label: "Select Size",
                    duration: '25 Jul @5:30 2s PM',
                    iconTriangle: false,
                    iconcursor: false,
                    iconmenu: false,
                    color: '#53b771',
                    details: [
                        {
                            label: 'URL',
                            value: 'httts://www.kohis.com'
                        },
                        {
                            label: 'Referrer ur',
                            value: 'null'
                        },
                        {
                            label: 'Load Time',
                            value: '19985 seconds'
                        }

                    ]
                },

                {
                    label: "Add to Cart",
                    duration: '25 Jul @5:30 2s PM',
                    iconTriangle: true,
                    iconcursor: true,
                    iconmenu: true,
                    color: '#ff4646',
                    details: [
                        {
                            label: 'URL',
                            value: 'httts://www.kohis.com'
                        },
                        {
                            label: 'Referrer ur',
                            value: 'null'
                        }
                    ]
                },
            ]
        },
        {
            label: 'Nike Revolution 5 FlyEase',
            duration: '25 Jul @5:30 2s PM',
            collapsed: false,
            menuOption: false,
            accordion: [
                {
                    label: "Select Size",
                    duration: '25 Jul @5:30 2s PM',
                    iconTriangle: true,
                    iconcursor: true,
                    iconmenu: false,
                    color: '#53b771',
                    details: [
                        {
                            url: 'httts://www.kohis.com',
                            refUrl: 'null',
                            loadTime: '',
                            dom: '',
                            renderTime: '',
                            byteTime: ''
                        }
                    ]
                },
                {
                    label: "Add to Cart",
                    duration: '25 Jul @5:30 2s PM',
                    iconTriangle: true,
                    iconcursor: true,
                    iconmenu: true,
                    color: '#ff4646'
                },
            ]
        }
    ],

    sessionDetails: [
        {
            label: 'SID',
            value: '65465464563213215'
        },
        {
            label: 'Client IP',
            value: '108.25.35.58'
        },
        {
            label: 'Max Onload',
            value: '19985 seconds'
        },
        {
            label: 'Max TTDI',
            value: '19985 seconds'
        }

    ]
};
