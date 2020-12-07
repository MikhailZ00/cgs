interface IBackResponse {
    'additional_fields'?: IAdditionFields[],
    'container_type'?: IContainerType[],
    'cargo_type'?: ICargoType[],
    'dest_city'?: IDestCity[],
    'src_city'?: ISrcCity[],
    'goods_price'?: IGoodsPrice[]
}
interface IGoodsPrice {
    cost: number
}
interface IAdditionFields {
    id: number,
    isChecked: string,
    name: string,
}

interface ICargoType {
    id: number,
    name: string
}

interface IContainerType {
    category: string,
    id: number,
    image: {
        active: string,
        inactive: string,
    },
    name: string
}

interface ISrcCity {
    coordinates: number[],
    id: number,
    name: string
}

interface IDestCity {
    coordinates: number[],
    id: number,
    name: string
}

interface IPostBody {
    date: string,
    'src_city': number,
    'dest_city': number,
    'cargo_type': number,
    'container_type': number,
    'src_addr': string,
    'goods_price': number,
    'additional_fields': ISelectedAdditionalFields
}


interface IPostResponse {
    price: number,
    status: number,
    'status_description': string
}

interface ISelectedAdditionalFields {
    [name: string]: boolean,
}

interface IDateRange {
    minDate: Date,
    maxDate: Date,
}