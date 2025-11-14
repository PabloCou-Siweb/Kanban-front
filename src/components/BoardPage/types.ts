export type BoardTaskItem = {
  id: string;
  title: string;
  description: string;
  owner: string;
  avatar: string;
  due: string;
  status: 'Pendiente' | 'En progreso' | 'En revisión' | 'Completado';
  priority: 'Alta' | 'Media' | 'Baja';
  createdAt: string;
  updatedAt: string;
};

