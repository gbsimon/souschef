/**
 * Recipe Card Component
 * Displays a recipe card with title, summary, and time
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
}

export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const formatTime = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const timeDisplay = formatTime(recipe.totalTime || recipe.cookTime || recipe.prepTime);

  const CardContent = (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        {timeDisplay && (
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{timeDisplay}</Text>
          </View>
        )}
      </View>
      {recipe.description && (
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>
      )}
      {recipe.servings && (
        <Text style={styles.servings}>
          Serves {recipe.servings}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={styles.touchable}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
}

const styles = StyleSheet.create({
  touchable: {
    marginVertical: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  timeBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  servings: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});
