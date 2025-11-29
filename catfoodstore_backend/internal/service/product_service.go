package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"catfoodstore_backend/internal/models"
	"catfoodstore_backend/internal/repository"
)

var (
	ErrProductNotFound = errors.New("product not found")
	ErrInvalidAgeGroup = errors.New("invalid age_group")
	ErrInvalidCategory = errors.New("invalid category")
)

type ProductService interface {
	GetAll(ctx context.Context) ([]*models.Product, error)
	GetByID(ctx context.Context, id int64) (*models.Product, error)
	Create(ctx context.Context, p *models.Product) (int64, error)
	Update(ctx context.Context, id int64, p *models.Product) error
	Delete(ctx context.Context, id int64) error
}

type productService struct {
	repo repository.ProductRepository
}

func NewProductService(r repository.ProductRepository) ProductService {
	return &productService{repo: r}
}

func (s *productService) GetAll(ctx context.Context) ([]*models.Product, error) {
	return s.repo.FindAll(ctx)
}

func (s *productService) GetByID(ctx context.Context, id int64) (*models.Product, error) {
	p, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, ErrProductNotFound
	}
	return p, nil
}

func (s *productService) Create(ctx context.Context, p *models.Product) (int64, error) {
	if err := validate(p); err != nil {
		return 0, err
	}
	return s.repo.Create(ctx, p)
}

func (s *productService) Update(ctx context.Context, id int64, p *models.Product) error {
	if err := validate(p); err != nil {
		return err
	}
	p.ID = id
	err := s.repo.Update(ctx, p)
	if err == sql.ErrNoRows {
		return ErrProductNotFound
	}
	return err
}

func (s *productService) Delete(ctx context.Context, id int64) error {
	err := s.repo.Delete(ctx, id)
	if err == sql.ErrNoRows {
		return ErrProductNotFound
	}
	return err
}

func validate(p *models.Product) error {
	switch p.AgeGroup {
	case "kitten", "adult", "special_care":
	default:
		return fmt.Errorf("%w: %s", ErrInvalidAgeGroup, p.AgeGroup)
	}

	switch p.Category {
	case "dry", "wet", "snack":
	default:
		return fmt.Errorf("%w: %s", ErrInvalidCategory, p.Category)
	}

	return nil
}