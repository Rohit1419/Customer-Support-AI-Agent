import type { ComponentType } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

type Features = {
  icon: ComponentType;
  title: string;
  description: string;
  cardBorderColor: string;
  avatarTextColor: string;
  avatarBgColor: string;
}[];

const Features = ({ featuresList }: { featuresList: Features }) => {
  return (
    <section className="py-8 sm:py-8 lg:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuresList.map((features, index) => (
            <Card
              key={index}
              className={cn(
                "shadow-none transition-colors duration-300",
                features.cardBorderColor
              )}
            >
              <CardContent className="pt-6">
                <Avatar
                  className={cn(
                    "mb-6 size-10 rounded-md",
                    features.avatarTextColor
                  )}
                >
                  <AvatarFallback
                    className={cn(
                      "rounded-md [&>svg]:size-6",
                      features.avatarBgColor
                    )}
                  >
                    <features.icon />
                  </AvatarFallback>
                </Avatar>
                <h6 className="mb-2 text-lg font-semibold">{features.title}</h6>
                <p className="text-muted-foreground">{features.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
