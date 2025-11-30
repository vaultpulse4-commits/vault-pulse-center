import { Router } from "express";
import prisma from "../prisma";
import { City } from "@prisma/client";

const router = Router();

// Get all areas (with optional city filter)
router.get("/", async (req, res) => {
  try {
    const { city, active } = req.query;
    
    const where: any = {};
    if (city) where.city = city as City;
    if (active !== undefined) where.isActive = active === "true";
    
    const areas = await prisma.area.findMany({
      where,
      include: {
        _count: {
          select: { equipment: true }
        }
      },
      orderBy: { name: "asc" }
    });
    
    res.json(areas);
  } catch (error) {
    console.error("Error fetching areas:", error);
    res.status(500).json({ error: "Failed to fetch areas" });
  }
});

// Get single area by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const area = await prisma.area.findUnique({
      where: { id },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        _count: {
          select: { equipment: true }
        }
      }
    });
    
    if (!area) {
      return res.status(404).json({ error: "Area not found" });
    }
    
    res.json(area);
  } catch (error) {
    console.error("Error fetching area:", error);
    res.status(500).json({ error: "Failed to fetch area" });
  }
});

// Create new area
router.post("/", async (req, res) => {
  try {
    const { name, description, city, isActive } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Area name is required" });
    }
    
    // Check if area with same name already exists
    const existing = await prisma.area.findUnique({
      where: { name }
    });
    
    if (existing) {
      return res.status(409).json({ error: "Area with this name already exists" });
    }
    
    const area = await prisma.area.create({
      data: {
        name,
        description: description || "",
        city: city || null,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    
    res.status(201).json(area);
  } catch (error) {
    console.error("Error creating area:", error);
    res.status(500).json({ error: "Failed to create area" });
  }
});

// Update area
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, city, isActive } = req.body;
    
    // Check if area exists
    const existing = await prisma.area.findUnique({
      where: { id }
    });
    
    if (!existing) {
      return res.status(404).json({ error: "Area not found" });
    }
    
    // If name is being changed, check for duplicates
    if (name && name !== existing.name) {
      const duplicate = await prisma.area.findUnique({
        where: { name }
      });
      
      if (duplicate) {
        return res.status(409).json({ error: "Area with this name already exists" });
      }
    }
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (city !== undefined) updateData.city = city;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const area = await prisma.area.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { equipment: true }
        }
      }
    });
    
    res.json(area);
  } catch (error) {
    console.error("Error updating area:", error);
    res.status(500).json({ error: "Failed to update area" });
  }
});

// Delete area
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if area exists
    const area = await prisma.area.findUnique({
      where: { id },
      include: {
        _count: {
          select: { equipment: true }
        }
      }
    });
    
    if (!area) {
      return res.status(404).json({ error: "Area not found" });
    }
    
    // Check if area is being used by equipment
    if (area._count.equipment > 0) {
      return res.status(409).json({ 
        error: "Cannot delete area that is being used by equipment",
        equipmentCount: area._count.equipment
      });
    }
    
    await prisma.area.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting area:", error);
    res.status(500).json({ error: "Failed to delete area" });
  }
});

// Toggle area active status
router.post("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    
    const area = await prisma.area.findUnique({
      where: { id }
    });
    
    if (!area) {
      return res.status(404).json({ error: "Area not found" });
    }
    
    const updated = await prisma.area.update({
      where: { id },
      data: { isActive: !area.isActive }
    });
    
    res.json(updated);
  } catch (error) {
    console.error("Error toggling area status:", error);
    res.status(500).json({ error: "Failed to toggle area status" });
  }
});

export default router;
