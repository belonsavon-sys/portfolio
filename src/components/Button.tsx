"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type {
  HTMLAttributeAnchorTarget,
  MouseEventHandler,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "ghost" | "ghostDark";

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type SharedElementProps = {
  "aria-describedby"?: string;
  "aria-label"?: string;
  id?: string;
  title?: string;
};

type ButtonAsButtonProps = ButtonBaseProps &
  SharedElementProps & {
    disabled?: boolean;
    href?: never;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
  };

type ButtonAsAnchorProps = ButtonBaseProps &
  SharedElementProps & {
    download?: boolean | string;
    href: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    rel?: string;
    target?: HTMLAttributeAnchorTarget;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

export type NavPillProps = {
  active?: boolean;
  children: ReactNode;
  className?: string;
  href: string;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-accent text-white",
  ghost: "border-accent bg-transparent text-accent",
  ghostDark: "border-accent bg-transparent text-text-dark",
};

const hoverFilter: Record<ButtonVariant, string> = {
  primary: "brightness(0.9)",
  ghost: "brightness(1.1)",
  ghostDark: "brightness(1.1)",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isInternalHref(href: string) {
  return href.startsWith("/");
}

function sharedProps(props: SharedElementProps) {
  return {
    "aria-describedby": props["aria-describedby"],
    "aria-label": props["aria-label"],
    id: props.id,
    title: props.title,
  };
}

export function Button(props: ButtonProps) {
  const {
    children,
    className,
    variant = "primary",
    ...rest
  } = props;

  const classes = cx(
    "inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-semibold transition-[filter,background,border-color,color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60",
    buttonVariants[variant],
    className,
  );

  const motionProps = {
    transition: { duration: 0.15 },
    whileHover: { filter: hoverFilter[variant] },
    whileTap: { scale: 0.97 },
  };

  if ("href" in rest && rest.href) {
    const { download, href, onClick, target, rel } = rest;
    const safeRel = target === "_blank" ? (rel ?? "noreferrer") : rel;

    if (isInternalHref(href) && !download) {
      return (
        <Link
          className="inline-flex rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          href={href}
          onClick={onClick}
          rel={safeRel}
          target={target}
          {...sharedProps(rest)}
        >
          <motion.span className={classes} {...motionProps}>
            {children}
          </motion.span>
        </Link>
      );
    }

    return (
      <motion.a
        className={classes}
        download={download}
        href={href}
        onClick={onClick}
        rel={safeRel}
        target={target}
        {...sharedProps(rest)}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  const buttonProps = rest as ButtonAsButtonProps;
  const { disabled, onClick, type = "button" } = buttonProps;

  return (
    <motion.button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...sharedProps(buttonProps)}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}

export function NavPill({
  active = false,
  children,
  className,
  href,
}: NavPillProps) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className="inline-flex rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      href={href}
    >
      <motion.span
        className={cx(
          "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-[filter,background,color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          active ? "bg-accent text-white" : "bg-transparent text-text-light",
          className,
        )}
        transition={{ duration: 0.15 }}
        whileHover={{ filter: active ? "brightness(0.9)" : "brightness(1.1)" }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
