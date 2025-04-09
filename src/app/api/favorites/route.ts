import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - fetch current user's favorites
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        providerId: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json({ 
      favorites: favorites.map((fav: { providerId: string }) => fav.providerId) 
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST - add a provider to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { providerId } = await request.json();
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_providerId: {
          userId: session.user.id,
          providerId: providerId.toString(),
        },
      },
    });
    
    if (existingFavorite) {
      return NextResponse.json({ 
        message: 'Already favorited',
        favorite: existingFavorite 
      });
    }
    
    // Create new favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        providerId: providerId.toString(),
      },
    });
    
    return NextResponse.json({ favorite });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// DELETE - remove a provider from favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { providerId } = await request.json();
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the favorite
    await prisma.favorite.delete({
      where: {
        userId_providerId: {
          userId: session.user.id,
          providerId: providerId.toString(),
        },
      },
    });
    
    return NextResponse.json({ 
      message: 'Favorite removed successfully' 
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
} 