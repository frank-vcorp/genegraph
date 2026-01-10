'use client';

import { useGenogramStore } from '@/store/genogram';

interface MedicalCondition {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ConditionDraggableProps {
  condition: MedicalCondition;
}

export default function ConditionDraggable({ condition }: ConditionDraggableProps) {
  const { setDraggingCondition } = useGenogramStore();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'condition', conditionId: condition.id }));
    setDraggingCondition(true, condition.id);
  };

  const handleDragEnd = () => {
    setDraggingCondition(false, null);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="p-3 bg-white rounded-lg border-2 border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-gray-400 transition-all"
      style={{ borderColor: condition.color + '40' }}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{condition.icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">{condition.name}</p>
          <p className="text-xs text-gray-500">Arrastra sobre persona</p>
        </div>
      </div>
    </div>
  );
}
