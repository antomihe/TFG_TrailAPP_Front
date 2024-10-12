import React from 'react';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { AthleteLinks, FederationLinks, MenuItemList, NationalFederationLinks, OfficialLinks, OrganizerLinks } from './MenuItems';

interface MenuGridProps {
  items: MenuItemList;
}

const MenuGrid: React.FC<MenuGridProps> = ({ items }) => {
  return (
    <div className="mx-auto px-8">
      <HoverEffect items={items} />
    </div>
  );
};

export const NationalFederationMenuGrid = () => <MenuGrid items={NationalFederationLinks} />;
export const FederationMenuGrid = () => <MenuGrid items={FederationLinks} />;
export const OrganizerMenuGrid = () => <MenuGrid items={OrganizerLinks} />;
export const OfficialMenuGrid = () => <MenuGrid items={OfficialLinks} />;
export const AthleteMenuGrid = () => <MenuGrid items={AthleteLinks} />;


