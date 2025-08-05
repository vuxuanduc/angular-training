import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-leaflet',
  imports: [NzSelectModule, CommonModule, ReactiveFormsModule],
  templateUrl: './leaflet.html',
  styleUrl: './leaflet.scss',
})
export class Leaflet implements OnInit, AfterViewInit {
  searchControl = new FormControl('');
  tileControl = new FormControl(localStorage.getItem('tileType') || 'osm');
  map!: L.Map;
  curentLayer!: L.TileLayer;
  tileOptions = [
    { label: 'OSM', value: 'osm' },
    { label: 'GG Road', value: 'gg_r' },
    { label: 'GG Satellite', value: 'gg_sat' },
    { label: 'GG Hibrid', value: 'gg_hib' },
  ];
  routePoints: { name: string; coords: [number, number] }[] = [
    { name: 'Hà Nội', coords: [21.0285, 105.8542] },
    { name: 'Thanh Hóa', coords: [20.1071694, 105.2124457] },
    { name: 'Nghệ An', coords: [19.3738868, 104.9233469] },
    { name: 'Huế', coords: [16.3375374, 107.5563708] },
    { name: 'Đà Nẵng', coords: [16.0471, 108.2062] },
    { name: 'Quảng Ngãi', coords: [14.9635349, 108.6642632] },
    { name: 'Khánh Hòa', coords: [12.1960803, 108.9950386] },
    { name: 'TP.HCM', coords: [10.7626, 106.6602] },
  ];

  customIcon = L.icon({
    iconUrl: 'assets/leaflet/marker-icon.png', // Đảm bảo icon nền trong suốt
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
    shadowUrl: '', // Không dùng bóng
  });

  ngOnInit(): void {
    this.tileControl.valueChanges.subscribe((value) => {
      localStorage.setItem('tileType', value!);
      this.switchLayer(value!);
    });
  }

  ngAfterViewInit(): void {
    this.showMap();

    const polyline = L.polyline(
      this.routePoints.map((p) => p.coords),
      {
        color: 'blue',
        weight: 4,
        opacity: 0.7,
        smoothFactor: 1,
      }
    ).addTo(this.map);

    // Fit bản đồ vào đường vẽ
    this.map.fitBounds(polyline.getBounds());

    // 👇 Thêm marker icon mặc định cho mỗi điểm
    this.routePoints.forEach((point) => {
      L.marker(point.coords, { icon: this.customIcon })
        .addTo(this.map)
        .bindPopup(point.name)
        .openPopup();
    });

    // Tạo cụm marker cluster
    const clusterGroup = (L as any).markerClusterGroup({
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        let color = 'green';
        if (count < 100) color = 'green';
        else if (count < 500) color = 'orange';
        else color = 'red';

        return L.divIcon({
          html: `<div class="cluster-icon" style="
        background-color: ${color};
        color: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);">
        ${count}</div>`,
          className: 'custom-cluster',
          iconSize: L.point(40, 40),
        });
      },
    });

    // Thêm 1000 marker ngẫu nhiên vào cụm
    for (let i = 0; i < 1000; i++) {
      const lat = 8 + Math.random() * 10;
      const lng = 104 + Math.random() * 8;
      const marker = L.marker([lat, lng]);
      marker.bindPopup(`📍 Marker ${i + 1}`);
      marker.on('mouseover', () => marker.openPopup());
      marker.on('mouseout', () => marker.closePopup());
      clusterGroup.addLayer(marker);
    }

    // Thêm cụm vào bản đồ
    this.map.addLayer(clusterGroup);
  }

  showMap(): void {
    this.map = L.map('map').setView([21.0315, 105.8351], 5);
    this.switchLayer(this.tileControl.value!);
  }

  switchLayer(type: string) {
    if (this.curentLayer) {
      this.map.removeLayer(this.curentLayer);
    }

    let layer: L.TileLayer;

    switch (type) {
      case 'osm':
        layer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 20,
            attribution: '&copy; OpenStreetMap',
          }
        );
        break;
      case 'gg_r':
        layer = L.tileLayer(
          'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        );
        break;
      case 'gg_sat':
        layer = L.tileLayer(
          'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        );
        break;
      case 'gg_hib':
        layer = L.tileLayer(
          'http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        );
        break;
      default:
        layer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap',
          }
        );
    }
    this.curentLayer = layer.addTo(this.map);
  }
}
