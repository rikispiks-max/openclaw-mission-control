"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, Activity } from "lucide-react";

export function EcosystemView() {
  const products = useQuery(api.ecosystemProducts.list);

  if (!products) {
    return <div className="skeleton h-96 rounded-2xl" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            href={`/ecosystem/${product.slug}`}
            className="block glass-card rounded-2xl p-6 hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.status}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                product.health === "healthy" ? "bg-success" : "bg-warning"
              }`} />
            </div>

            {product.metrics && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {Object.entries(product.metrics).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="p-2 rounded-lg bg-white/[0.03]">
                    <p className="text-2xs text-muted-foreground capitalize">{key}</p>
                    <p className="text-sm font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
