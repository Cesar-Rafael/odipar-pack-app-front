import { useEffect } from "react"
import L from "leaflet"
import "./Legend.css"

function Legend({ map }) {
    const data = [
        { color: '#C72E30', label: 'Almacenes' },
        { color: '#6E5600', label: 'Oficinas' },
        { color: '#1828BA', label: 'Vehículos' },
        { color: '#7F7F7F', label: 'Tramos' },
        { color: '#A12C22', label: 'Bloqueos' },
    ]

    useEffect(() => {
        if (map) {
            const legend = L.control({ position: "topright" });

            legend.onAdd = () => {
                const div = L.DomUtil.create("div", "info legend");
                div.innerHTML += "<h5>Leyenda:</h5>" + data.map(element => `<i style="background: ${element.color}; color: ${element.color}">....</i><span>${'  ' + element.label}</span><br>`).join('')
                return div;
            };

            legend.addTo(map);
        }
    }, [map]);
    return null;
}

export default Legend;
