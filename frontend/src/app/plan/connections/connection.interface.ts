export interface Connections {
  connections: Array<Connection>
}

export interface Connection {
  from: string,
  to: string,
  depart: number,
  arrival: number,
  ranking: number,
  sections: Array<Section>
}

export interface Section {
  fromStationId: string,
  toStationId: string,
  route: string,
  load: number
}
