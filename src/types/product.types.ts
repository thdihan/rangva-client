export type TCategory = {
    id?: string;
    name: string;
    description?: string;
    image: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type TCategoryResponse = TCategory[];
