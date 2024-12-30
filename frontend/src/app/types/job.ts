export interface Job {
    id: string;
    status: 'pending' | 'processing' | 'resolved' | 'failed';
    result?: string;
    createdAt: string;
    name: string;
}  