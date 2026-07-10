export interface ActionPlan{
    idActionPlan?: string;
    idFarmer?: string;
    priority?: Priority;
    activity?: string;
    technician?: string;
    recommendations?: string;
    findings?: string;
    dueDate?: string;
    implementation?: number;
}

export enum Priority {
    Medium = 'Medium',
    High = 'High',
    Low = 'Low'
}